import requests
import feedparser
import json
import re
import time
import os
from datetime import datetime
from bs4 import BeautifulSoup

# Configuration
FRIENDS_USERNAMES = [
    "snyda",
    "danielbrenneman",
    "calket",
    "ryjohnst",
    "maggiecrawford",
    "gwbull",
    "nicjbull",
    "jacobmacp",
    "delvinm"
]

OUTPUT_DIR = "../public/data"
OUTPUT_FILE = "letterboxd_reviews.json"
MIN_REVIEW_LENGTH = 50  # Minimum characters for a review to be included

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def fetch_rss_feed(username):
    """Fetch the RSS feed for a given Letterboxd username."""
    url = f"https://letterboxd.com/{username}/rss/"
    print(f"Fetching from URL: {url}")
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        print(f"Response status: {response.status_code}")
        print(f"Response size: {len(response.content)} bytes")
        return response.content
    except requests.exceptions.RequestException as e:
        print(f"Error fetching RSS feed for {username}: {e}")
        return None

def fetch_movie_details(movie_url):
    """Fetch additional movie details from the Letterboxd movie page."""
    print(f"Fetching movie details from: {movie_url}")
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(movie_url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract director
        director = None
        director_section = soup.select_one('div.film-poster + div h3:contains("Director")')
        if director_section:
            director_link = director_section.find_next('a')
            if director_link:
                director = director_link.text.strip()
        
        # If we couldn't find director with the first method, try another approach
        if not director:
            director_link = soup.select_one('a[href*="/director/"]')
            if director_link:
                director = director_link.text.strip()
        
        # Extract cast (first few actors)
        cast = []
        cast_section = soup.select_one('div.film-poster + div h3:contains("Cast")')
        if cast_section:
            cast_links = cast_section.find_next('div').find_all('a', limit=3)
            cast = [link.text.strip() for link in cast_links]
        
        # If we couldn't find cast with the first method, try another approach
        if not cast:
            cast_links = soup.select('a[href*="/actor/"]')[:3]  # Get first 3 actors
            cast = [link.text.strip() for link in cast_links]
        
        # Extract genres
        genres = []
        genre_links = soup.select('a[href*="/films/genre/"]')
        genres = [link.text.strip() for link in genre_links]
        
        # Extract runtime
        runtime = None
        runtime_text = soup.select_one('p.text-link')
        if runtime_text:
            runtime_match = re.search(r'(\d+)min', runtime_text.text)
            if runtime_match:
                runtime = int(runtime_match.group(1))
        
        # Extract poster URL
        poster_url = None
        poster_img = soup.select_one('div.film-poster img')
        if poster_img and 'src' in poster_img.attrs:
            poster_url = poster_img['src']
            # Convert to larger image if it's a thumbnail
            poster_url = re.sub(r'-0-.*\.jpg', '-0-500-0-750.jpg', poster_url)
        
        return {
            'director': director,
            'cast': cast,
            'genres': genres,
            'runtime': runtime,
            'poster_url': poster_url
        }
    except Exception as e:
        print(f"Error fetching movie details: {e}")
        return {
            'director': None,
            'cast': [],
            'genres': [],
            'runtime': None,
            'poster_url': None
        }

def extract_review_from_description(description):
    """Extract the actual review text from the HTML description."""
    soup = BeautifulSoup(description, 'html.parser')
    
    # Remove the poster image if present
    if soup.img:
        soup.img.decompose()
    
    # Get all paragraphs
    paragraphs = soup.find_all('p')
    
    # If there are paragraphs, join them
    if paragraphs:
        review_text = ' '.join(p.get_text() for p in paragraphs)
    else:
        # If no paragraphs, just get all text
        review_text = soup.get_text()
    
    # Clean up the text
    review_text = review_text.strip()
    
    return review_text

def parse_movie_entry(entry, username):
    """Parse a single RSS entry into a movie and review object."""
    if not hasattr(entry, 'title'):
        print("Entry has no title")
        return None
    
    print(f"Parsing entry: {entry.title}")
    
    # Check if this is a list, not a movie review
    if "Ranked" in entry.title or "Top 10" in entry.title or "list" in entry.title.lower():
        print(f"This appears to be a list, not a movie review: {entry.title}")
        return None
    
    # Extract movie title and year
    # Format is typically "Movie Title, Year - ★★★" or "Movie Title - ★★★"
    title_parts = entry.title.split(' - ')
    if len(title_parts) < 2:
        print(f"Unexpected title format: {entry.title}")
        return None
    
    movie_info = title_parts[0].strip()
    rating_info = title_parts[1].strip() if len(title_parts) > 1 else ""
    
    # Check for spoilers tag and remove it
    if "(contains spoilers)" in rating_info:
        rating_info = rating_info.replace("(contains spoilers)", "").strip()
    
    # Extract year if present
    year_match = re.search(r',\s*(\d{4})$', movie_info)
    year = None
    if year_match:
        year = int(year_match.group(1))
        movie_title = movie_info[:year_match.start()].strip()
    else:
        movie_title = movie_info
    
    # Extract rating
    rating = None
    rating_match = re.search(r'(★+)(½)?', rating_info)
    if rating_match:
        full_stars = len(rating_match.group(1))
        half_star = 0.5 if rating_match.group(2) else 0
        rating = full_stars + half_star
    
    # Extract review text from description
    review_text = None
    if hasattr(entry, 'description'):
        review_text = extract_review_from_description(entry.description)
    
    # Skip entries with no review text or very short reviews
    if not review_text or len(review_text) < MIN_REVIEW_LENGTH:
        print(f"Review text too short or missing for: {entry.title}")
        return None
    
    # Extract review date
    review_date = None
    if hasattr(entry, 'published'):
        review_date = entry.published
    
    # Get the movie URL for fetching additional details
    movie_url = None
    if hasattr(entry, 'link'):
        # Convert review URL to movie URL by removing the username part
        movie_url = re.sub(r'(/[^/]+/film/)', r'/film/', entry.link)
    
    # Create a unique ID for the movie
    movie_id = f"{movie_title.lower().replace(' ', '-')}-{year if year else 'unknown'}"
    
    print(f"Extracted: Movie: '{movie_title}', Year: {year}, Rating: {rating}")
    print(f"Review text ({len(review_text)} chars): {review_text[:50]}...")
    
    # Fetch additional movie details if we have a URL
    movie_details = {}
    if movie_url:
        movie_details = fetch_movie_details(movie_url)
        # Be nice to the server
        time.sleep(1)
    
    return {
        "movie": {
            "id": movie_id,
            "title": movie_title,
            "year": year,
            "director": movie_details.get('director'),
            "cast": movie_details.get('cast', []),
            "genres": movie_details.get('genres', []),
            "runtime": movie_details.get('runtime'),
            "poster_url": movie_details.get('poster_url')
        },
        "review": {
            "text": review_text,
            "rating": rating,
            "reviewer": username,
            "date": review_date,
            "url": entry.link if hasattr(entry, 'link') else ""
        }
    }

def scrape_letterboxd_reviews():
    """Scrape reviews from Letterboxd RSS feeds."""
    all_reviews = []
    
    for username in FRIENDS_USERNAMES:
        print(f"\nFetching reviews for {username}...")
        feed_content = fetch_rss_feed(username)
        
        if not feed_content:
            print(f"No content received for {username}")
            continue
        
        feed = feedparser.parse(feed_content)
        
        print(f"Feed title: {feed.feed.title if hasattr(feed, 'feed') and hasattr(feed.feed, 'title') else 'No title'}")
        print(f"Number of entries: {len(feed.entries)}")
        
        if len(feed.entries) == 0:
            print("No entries found in feed")
            continue
        
        for entry in feed.entries:
            # Skip lists and only process movie entries
            if hasattr(entry, 'title') and not any(keyword in entry.title for keyword in ["Ranked", "Top 10", "list"]):
                review_data = parse_movie_entry(entry, username)
                if review_data:
                    all_reviews.append(review_data)
                    print(f"Successfully parsed review for: {review_data['movie']['title']}")
                else:
                    print("Failed to parse or skipped review")
        
        # Be nice to the server
        time.sleep(1)
    
    # Create a dictionary with movies and reviews
    movies = {}
    reviews = []
    
    for item in all_reviews:
        movie = item["movie"]
        review = item["review"]
        
        # Add movie if not already in the dictionary
        if movie["id"] not in movies:
            movies[movie["id"]] = movie
        else:
            # If movie already exists, update any missing details
            existing_movie = movies[movie["id"]]
            for key, value in movie.items():
                if key != "id" and (key not in existing_movie or not existing_movie[key]) and value:
                    existing_movie[key] = value
        
        # Add review with reference to movie ID
        review["movieId"] = movie["id"]
        reviews.append(review)
    
    # Create the final data structure
    data = {
        "movies": list(movies.values()),
        "reviews": reviews,
        "metadata": {
            "generated": datetime.now().isoformat(),
            "count": len(reviews)
        }
    }
    
    # Save to JSON file
    output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\nScraped {len(reviews)} reviews for {len(movies)} movies.")
    print(f"Data saved to {output_path}")
    
    return data

def manually_parse_xml(file_path):
    """Manually parse an XML file for debugging."""
    print(f"\n--- Manually parsing {file_path} ---")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            xml_content = f.read()
        
        feed = feedparser.parse(xml_content)
        
        print(f"Feed version: {feed.version}")
        if hasattr(feed, 'feed') and hasattr(feed.feed, 'title'):
            print(f"Feed title: {feed.feed.title}")
        else:
            print("Feed has no title attribute")
        
        print(f"Number of entries: {len(feed.entries)}")
        
        if len(feed.entries) > 0:
            for i, entry in enumerate(feed.entries[:3]):  # Show first 3 entries
                print(f"\nEntry {i+1}:")
                print(f"Title: {entry.title if hasattr(entry, 'title') else 'No title'}")
                if hasattr(entry, 'description'):
                    print(f"Description: {entry.description[:100]}...")
                if hasattr(entry, 'published'):
                    print(f"Published: {entry.published}")
                if hasattr(entry, 'link'):
                    print(f"Link: {entry.link}")
    except Exception as e:
        print(f"Error parsing XML: {e}")

if __name__ == "__main__":
    # First try to manually parse the test feed if it exists
    if os.path.exists("test_feed.xml"):
        manually_parse_xml("test_feed.xml")
    
    # Then run the main scraper
    scrape_letterboxd_reviews() 