import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AppPageContainer } from '../components/SharedStyles';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

// Register the chart components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Modern container
const ModernContainer = styled(AppPageContainer)`
  background: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  padding: 0;
  overflow: auto;
`;

// Fresh, modern header
const ModernHeader = styled.div`
  background: linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModernTitle = styled.h1`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const BackLink = styled(Link)`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  margin-bottom: 10px;
  text-decoration: none;
  border-radius: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const MainContent = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  min-height: 500px;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
`;


const StartButton = styled.button`
  background: #5c6bc0;
  color: white;
  border: none;
  padding: 12px 28px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: #3949ab;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const InfoText = styled.p`
  line-height: 1.6;
  color: #555;
  margin-bottom: 16px;
  font-size: 16px;
`;

// Types for our quiz structure
interface QuizQuestion {
  id: number;
  text: string;
  category: string;
  // Which school each response favors (higher = more favorable)
  weightings: {
    ubc: number;  // University of British Columbia
    mcgill: number;  // McGill
    dublin: number;  // University of Dublin
  };
}

interface UserResponse {
  questionId: number;
  value: number; // 1-7 scale
}

// Updated value categories based on your new structure
const valueCategories = [
  "Time & Efficiency",
  "Cultural Exposure & Experience", // Removed "International"
  "Family, Social Connections",
  "Financial Investment & Risk",
  "Personal Growth & Adventure",
  "Reputation & Career Advancement",
  "Practicality & Adaptability",
  "Urban vs. Natural Environments",
  "Sustainability & Long-Term Impact"
];

// Updated category mapping
const categoryMapping: {[key: string]: string} = {
  "Time & Efficiency (T&E)": "Time & Efficiency",
  "Cultural Exposure & International Experience (CE/IE)": "Cultural Exposure & Experience", // Updated mapped value
  "Family, Social Connections & Life Partner (FSC)": "Family, Social Connections",
  "Financial Investment & Risk (FIR)": "Financial Investment & Risk",
  "Personal Growth & Adventure (PGA)": "Personal Growth & Adventure",
  "Reputation & Career Advancement (RCA)": "Reputation & Career Advancement",
  "Practicality & Adaptability (PA)": "Practicality & Adaptability",
  "Urban vs. Natural Environments (UNE)": "Urban vs. Natural Environments",
  "Sustainability & Long-Term Impact (STLI)": "Sustainability & Long-Term Impact"
};

// Updated quiz questions with new categories and weightings
const quizQuestions: QuizQuestion[] = [
  // Time & Efficiency (T&E) – Questions 1–10
  {
    id: 1,
    text: "I prefer a concise academic program that delivers career skills quickly.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 2,
    text: "I value fast-paced learning experiences that minimize time spent on redundant tasks.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 3,
    text: "I find academic efficiency crucial for advancing my career.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 4,
    text: "I believe that reducing the time to graduation is important for staying competitive.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 5,
    text: "A shorter educational pathway appeals to me because it accelerates professional entry.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 6,
    text: "I appreciate programs that streamline learning and focus on essential skills.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 7,
    text: "I would rather have a focused, time-efficient program than a longer, drawn-out one.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 8,
    text: "I feel that every extra year in school should offer clear additional benefits.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 9,
    text: "Rapid skill acquisition is a priority when evaluating educational programs.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  {
    id: 10,
    text: "I value academic paths that allow me to enter the workforce sooner.",
    category: "Time & Efficiency (T&E)",
    weightings: { ubc: 4, mcgill: 5, dublin: 9 }
  },
  
  // Cultural Exposure & International Experience (CE/IE) – Questions 11–20
  {
    id: 11,
    text: "I am excited by the prospect of studying in a completely foreign country.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 12,
    text: "Experiencing a new culture is as important as academic rigor.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 13,
    text: "I value learning from diverse cultural perspectives.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 14,
    text: "Being immersed in a different cultural environment enriches my life.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 15,
    text: "I am eager to experience cultural nuances that differ from my own.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 16,
    text: "I believe international experiences broaden my worldview.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 17,
    text: "Navigating a new cultural setting would be a rewarding challenge.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 18,
    text: "Studying abroad offers unique insights that domestic programs may not provide.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 19,
    text: "Exposure to international perspectives is essential for understanding global issues.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  {
    id: 20,
    text: "I value opportunities that push me to engage with cultures beyond my own.",
    category: "Cultural Exposure & International Experience (CE/IE)",
    weightings: { ubc: 7, mcgill: 6, dublin: 9 }
  },
  
  // Family, Social Connections & Life Partner (FSC) – Questions 21–35
  {
    id: 21,
    text: "Staying close to family and friends is a top priority for me.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 22,
    text: "I value proximity to my social support network.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 23,
    text: "I believe that personal relationships are crucial to overall happiness.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 24,
    text: "Being near loved ones provides a sense of security and comfort.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 25,
    text: "I prioritize maintaining strong connections with people who matter to me.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 26,
    text: "I feel that my social life significantly impacts my well-being.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 27,
    text: "An environment that fosters a sense of community is important to me.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 28,
    text: "I prefer educational settings where I can easily connect with peers.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 29,
    text: "Long-term friendships developed during my studies are highly valuable.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 30,
    text: "I believe that a supportive community enhances both academic and personal success.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 31,
    text: "Being physically close to my significant other is important to my emotional well-being.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 32,
    text: "I believe that frequent in-person time with my life partner is necessary for a healthy relationship.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 33,
    text: "I would struggle with a long-distance relationship over an extended period.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 34,
    text: "Daily interactions with my life partner play a key role in my happiness and stability.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  {
    id: 35,
    text: "I prioritize being in the same city as my significant other when making major life choices.",
    category: "Family, Social Connections & Life Partner (FSC)",
    weightings: { ubc: 5, mcgill: 9, dublin: 4 }
  },
  
  // Financial Investment & Risk (FIR) – Questions 36–45
  {
    id: 36,
    text: "I am willing to invest financially in quality education if the payoff is clear.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 37,
    text: "Taking financial risks for significant career benefits is acceptable to me.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 38,
    text: "I am comfortable with higher expenses when they lead to a better academic experience.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 39,
    text: "I carefully consider financial costs when evaluating educational opportunities.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 40,
    text: "Investing in education is worthwhile, even if it involves some risk.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 41,
    text: "I am open to financial challenges if they lead to long-term rewards.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 42,
    text: "I believe that spending more now can result in greater future benefits.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 43,
    text: "I see financial risk as a necessary part of pursuing ambitious goals.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 44,
    text: "Budget considerations are an important factor in my academic decisions.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  {
    id: 45,
    text: "I feel that a smart financial investment in education can pay off significantly.",
    category: "Financial Investment & Risk (FIR)",
    weightings: { ubc: 6, mcgill: 6, dublin: 4 }
  },
  
  // Personal Growth & Adventure (PGA) – Questions 46–55
  {
    id: 46,
    text: "I thrive when I step out of my comfort zone.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 47,
    text: "I value opportunities that challenge me to grow personally.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 48,
    text: "Adventurous experiences are key to my personal development.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 49,
    text: "I believe that taking risks is essential for meaningful personal growth.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 50,
    text: "I am excited by challenges that push me to my limits.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 51,
    text: "Exploring new environments is both invigorating and transformative.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 52,
    text: "I embrace uncertainty as a pathway to self-improvement.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 53,
    text: "I prioritize adventure as much as professional achievement.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 54,
    text: "Facing difficult challenges contributes significantly to my personal growth.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  {
    id: 55,
    text: "Taking bold steps is essential for leading a fulfilling life.",
    category: "Personal Growth & Adventure (PGA)",
    weightings: { ubc: 8, mcgill: 6, dublin: 9 }
  },
  
  // Reputation & Career Advancement (RCA) – Questions 56–65
  {
    id: 56,
    text: "I believe that the reputation of an institution significantly influences my future career.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 57,
    text: "A prestigious academic program is important for professional networking.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 58,
    text: "I value the long-term career benefits that come from a well-known institution.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 59,
    text: "Academic prestige is a signal of quality and dedication.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 60,
    text: "I am willing to work harder if it means gaining a respected qualification.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 61,
    text: "I see a strong institutional brand as a pathway to better career opportunities.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 62,
    text: "Career advancement opportunities should be a major consideration in my education.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 63,
    text: "I believe that a renowned program will open more professional doors.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 64,
    text: "The long-term impact of my education on my career is a key factor in my decision.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  {
    id: 65,
    text: "I trust that a reputable institution will offer superior job placement support.",
    category: "Reputation & Career Advancement (RCA)",
    weightings: { ubc: 9, mcgill: 9, dublin: 5 }
  },
  
  // Practicality & Adaptability (PA) – Questions 66–75
  {
    id: 66,
    text: "I value practical, hands-on learning experiences over purely theoretical studies.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 67,
    text: "Adaptability in an academic setting is crucial for long-term success.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 68,
    text: "I appreciate programs that integrate real-world applications into the curriculum.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 69,
    text: "I prioritize educational experiences that equip me with immediately applicable skills.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 70,
    text: "Being adaptable and resourceful is essential for thriving in new environments.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 71,
    text: "I believe that practical learning prepares me better for everyday challenges.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 72,
    text: "Flexibility in adapting to different situations is a key part of my learning style.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 73,
    text: "I value a curriculum that strikes a balance between theory and practice.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 74,
    text: "Real-world problem-solving is a critical component of effective education.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  {
    id: 75,
    text: "I prefer making decisions based on practical considerations over idealistic ones.",
    category: "Practicality & Adaptability (PA)",
    weightings: { ubc: 7, mcgill: 6, dublin: 8 }
  },
  
  // Urban vs. Natural Environments (UNE) – Questions 76–85
  {
    id: 76,
    text: "I thrive in urban settings that offer modern amenities and social opportunities.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 77,
    text: "I appreciate the vibrancy and energy of city life.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 78,
    text: "I value easy access to nature and outdoor recreational activities.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 79,
    text: "A balance between urban convenience and natural beauty is ideal for me.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 80,
    text: "I enjoy environments that provide both cultural amenities and natural escapes.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 81,
    text: "City life provides the pace and connectivity I desire.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 82,
    text: "I find that natural settings help me recharge and maintain balance.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 83,
    text: "I appreciate the contrast between a bustling urban environment and serene nature.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 84,
    text: "Access to green spaces is important for my overall well-being.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  {
    id: 85,
    text: "I value living in a place that combines metropolitan energy with natural beauty.",
    category: "Urban vs. Natural Environments (UNE)",
    weightings: { ubc: 9, mcgill: 6, dublin: 5 }
  },
  
  // Sustainability & Long-Term Impact (STLI) – Questions 86–100
  {
    id: 86,
    text: "I value educational experiences that emphasize sustainability and long-term impact.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 87,
    text: "I am committed to making choices that promote environmental responsibility.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 88,
    text: "I believe that sustainable practices today will benefit future generations.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 89,
    text: "I appreciate programs that integrate sustainability into their curriculum.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 90,
    text: "I consider the long-term impact of my education on society in my decisions.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 91,
    text: "I value a forward-thinking approach that prioritizes sustainability.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 92,
    text: "I believe that adopting sustainable practices is essential for long-term success.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 93,
    text: "I am motivated by academic environments that advocate for environmental stewardship.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 94,
    text: "I value the role of sustainability in shaping future opportunities.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 95,
    text: "I prioritize academic institutions that lead in sustainability research.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 96,
    text: "I believe that climate-conscious urban planning is critical for future cities.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 97,
    text: "I consider my personal environmental impact when choosing where to live and study.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 98,
    text: "A university's commitment to sustainability influences my perception of its values.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 99,
    text: "I want my education to contribute to solving environmental challenges.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  },
  {
    id: 100,
    text: "I believe sustainability is a key factor in future career opportunities.",
    category: "Sustainability & Long-Term Impact (STLI)",
    weightings: { ubc: 9, mcgill: 6, dublin: 6 }
  }
];

// Likert scale options
const likertOptions = [
  "Strongly Disagree",
  "Disagree", 
  "Somewhat Disagree",
  "Neutral",
  "Somewhat Agree",
  "Agree",
  "Strongly Agree"
];

// Add this constant for category abbreviations
const categoryAbbreviations: {[key: string]: string} = {
  "Time & Efficiency": "T&E",
  "Cultural Exposure & Experience": "CE", // Updated key name
  "Family, Social Connections": "FSC",
  "Financial Investment & Risk": "FIR",
  "Personal Growth & Adventure": "PGA",
  "Reputation & Career Advancement": "RCA",
  "Practicality & Adaptability": "PA",
  "Urban vs. Natural Environments": "UNE",
  "Sustainability & Long-Term Impact": "STLI"
};

// Styled components for quiz UI
const QuestionCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const QuestionText = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 500;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Option = styled.button<{ $selected?: boolean }>`
  padding: 10px 5px;
  border: 1px solid #ddd;
  background: ${props => props.$selected ? '#5c6bc0' : 'white'};
  color: ${props => props.$selected ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  text-align: center;
  
  &:hover {
    background: ${props => props.$selected ? '#3949ab' : '#f0f0f0'};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 20px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: #5c6bc0;
  transition: width 0.3s ease;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const NavButton = styled.button`
  background: #5c6bc0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  
  &:disabled {
    background: #c5cae9;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #3949ab;
  }
`;

const CategoryHeading = styled.h3`
  color: #5c6bc0;
  margin-top: 0;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

// Add these styled components for the results page
const ResultsContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
`;

// Find this SchoolName styled component (around line 909) 
// and rename it to ResultSchoolName
const ResultSchoolName = styled.h3`
  margin-top: 0;
  color: #3949ab;
  font-size: 24px;
`;

const MatchPercentage = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: 20px 0;
  color: #5c6bc0;
`;

const MatchBar = styled.div`
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0 20px;
`;

const MatchFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: linear-gradient(90deg, #5c6bc0 0%, #3949ab 100%);
  transition: width 1s ease-out;
`;

const SchoolInfo = styled.p`
  text-align: left;
  line-height: 1.6;
`;

const RestartButton = styled.button`
  background: #5c6bc0;
  color: white;
  border: none;
  padding: 12px 28px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: #3949ab;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Add these styled components for the key factors
const KeyFactorsContainer = styled.div`
  margin-top: 20px;
  text-align: left;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const KeyFactorTitle = styled.h4`
  margin-top: 0;
  color: #3949ab;
`;

const KeyFactorList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

// Styled components for the value categories visualization
const ValueCategoriesContainer = styled.div`
  margin-bottom: 30px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

// Replace CategoryGrid with these tab components
const ChipsContainer = styled.div`
  margin-top: 20px;
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Chip = styled.div<{ $isActive: boolean; $colorIndex: number }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
  
  // Dynamic colors based on category
  background: ${props => {
    const colors = [
      props.$isActive ? '#3949ab' : '#e8eaf6', // blue
      props.$isActive ? '#43a047' : '#e8f5e9', // green
      props.$isActive ? '#e53935' : '#ffebee', // red
      props.$isActive ? '#fb8c00' : '#fff3e0', // orange
      props.$isActive ? '#8e24aa' : '#f3e5f5', // purple
      props.$isActive ? '#00acc1' : '#e0f7fa'  // teal
    ];
    return colors[props.$colorIndex % colors.length];
  }};
  
  color: ${props => props.$isActive ? 'white' : '#333'};
  font-weight: ${props => props.$isActive ? '600' : '500'};
  box-shadow: ${props => props.$isActive ? '0 3px 8px rgba(0,0,0,0.2)' : 'none'};
  transform: ${props => props.$isActive ? 'translateY(-2px)' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    background: ${props => {
      const colors = [
        props.$isActive ? '#3949ab' : '#c5cae9', // blue hover
        props.$isActive ? '#43a047' : '#c8e6c9', // green hover
        props.$isActive ? '#e53935' : '#ffcdd2', // red hover
        props.$isActive ? '#fb8c00' : '#ffe0b2', // orange hover
        props.$isActive ? '#8e24aa' : '#e1bee7', // purple hover
        props.$isActive ? '#00acc1' : '#b2ebf2'  // teal hover
      ];
      return colors[props.$colorIndex % colors.length];
    }};
  }
`;

const ChipScore = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$isActive ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'};
  font-size: 12px;
  font-weight: 600;
  padding: 0 4px;
`;

const CategoryContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-top: 20px;
`;

const SectionSubtitle = styled.h4`
  color: #3949ab;
  margin-top: 0;
  margin-bottom: 15px;
`;

// Add styled components for the expandable details
const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #3949ab;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DetailsContainer = styled.div`
  margin-top: 10px;
  font-size: 14px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  
  &.expanded {
    max-height: 500px;
    padding: 15px;
    overflow-y: auto;
  }
`;

const QuestionItem = styled.div`
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const DetailQuestionText = styled.div`
  margin-bottom: 4px;
  line-height: 1.4;
`;

const ResponseValue = styled.div<{ $value: number }>`
  display: inline-block;
  background: ${props => {
    // Color gradient based on response value
    const colors = [
      '#f44336', // 1 - red
      '#ff7043', // 2 - orange-red
      '#ffa726', // 3 - orange
      '#ffca28', // 4 - yellow
      '#9ccc65', // 5 - light green
      '#66bb6a', // 6 - green
      '#26a69a'  // 7 - teal
    ];
    return colors[props.$value - 1];
  }};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
`;

const ResponseLabel = styled.span`
  margin-left: 8px;
  color: #555;
`;

// Make sure this is defined BEFORE the GradSchoolQuiz component
// Add this with other styled components, around line 560-570
const CategoryDetails = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 16px;
  
  /* Remove max-height restriction */
  height: auto;
  overflow: visible;
`;

// Add this styled component for the chart container
const ChartContainer = styled.div`
  max-width: 500px;
  margin: 20px auto 30px;
`;

// Add these styled components for the list view
const CategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
`;

const CategoryListItem = styled.li`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const CategoryHeader = styled.div<{ $colorIndex: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: ${props => {
    const colors = [
      '#e8eaf6', // blue
      '#e8f5e9', // green
      '#ffebee', // red
      '#fff3e0', // orange
      '#f3e5f5', // purple
      '#e0f7fa'  // teal
    ];
    return colors[props.$colorIndex % colors.length];
  }};
  cursor: pointer;
  font-weight: 500;
`;

const CategoryTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryAbbr = styled.span`
  font-weight: 600;
  color: #3949ab;
`;

const CategoryScore = styled.span`
  background: rgba(0,0,0,0.1);
  border-radius: 16px;
  padding: 4px 10px;
  font-size: 14px;
  font-weight: 600;
`;

// Update ExpandableCategoryContent to allow proper scrolling
const ExpandableCategoryContent = styled.div<{ $isOpen: boolean }>`
  background: white;
  height: ${props => props.$isOpen ? 'auto' : '0'};
  max-height: ${props => props.$isOpen ? 'none' : '0'};
  overflow: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: height 0.3s ease;
`;

// Update CategoryQuestions to ensure proper scrolling
const CategoryQuestions = styled.div`
  padding: 15px;
  height: auto;
  overflow: visible;
`;

// Add this styled component for the debug button
const DebugButton = styled.button`
  background: #f1f1f1;
  color: #666;
  border: 1px dashed #999;
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    background: #e0e0e0;
  }
`;

// Add these styled components
const CalibrationContainer = styled.div`
  margin: 30px 0;
`;

const CategoryCalibration = styled.div`
  margin-bottom: 30px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const CategoryDescription = styled.p`
  margin-bottom: 20px;
  color: #555;
  font-size: 15px;
  line-height: 1.5;
`;

const SliderContainer = styled.div`
  margin: 25px 0;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SchoolName = styled.span`
  font-weight: 500;
  color: #333;
`;

const SliderValue = styled.span`
  color: #3949ab;
  font-weight: 600;
  background: rgba(57, 73, 171, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 14px;
`;

// Update the StyledSlider to look smoother and more visually appealing
const StyledSlider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 8px;
  background: linear-gradient(to right, #e0e0e0, #e0e0e0);
  outline: none;
  margin: 12px 0;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #3949ab;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
  }
  
  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #3949ab;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
  }
  
  &::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
  }
  
  &::-webkit-slider-runnable-track,
  &::-moz-range-track {
    height: 8px;
    border-radius: 8px;
    background: #e0e0e0;
  }
`;

// Add a styled component for the value labels without numbers
const SliderLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SliderEndLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  margin-top: -6px;
  margin-bottom: 20px;
`;

// Change these styled components (the ones we're adding for calibration)

// Change ProgressBar to CalibrationProgressBar
const CalibrationProgressBar = styled.div`
  margin-top: 20px;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  position: relative;
`;

// Change ProgressFill to CalibrationProgressFill
const CalibrationProgressFill = styled.div<{ $percentage: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.$percentage}%;
  background: #3949ab;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

// Change SchoolName to SchoolLabel in the calibration section
const SchoolLabel = styled.span`
  font-weight: 500;
  color: #333;
`;

// Add styled components for the help icon and explanation
const HelpIconButton = styled.button`
  background: none;
  border: 1px solid #c5cae9;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #5c6bc0;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  transition: all 0.2s ease;
  vertical-align: middle;
  
  &:hover {
    background: #f5f7ff;
  }
`;

const ExplanationPopover = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  // Change positioning to be more dynamic
  top: calc(100% + 10px);
  left: 50%;
  transform: ${props => props.$isVisible 
    ? 'translate(-50%, 0)' 
    : 'translate(-50%, -8px)'};
  width: 400px;
  max-width: calc(100vw - 40px); // Prevent horizontal overflow
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  z-index: 100;
  text-align: left;
  
  // Adjust arrow position for centered alignment
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: white;
    border-left: 1px solid #e0e0e0;
    border-top: 1px solid #e0e0e0;
  }
`;

const ExplanationTitle = styled.div`
  color: #303f9f;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
`;

const ExplanationSection = styled.div`
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #555;
`;

const ExplanationList = styled.ul`
  margin: 8px 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 4px;
  }
`;


const SectionTitle = styled.div`
  font-size: 24px;  // Increased from previous size
  font-weight: 600;
  color: #303f9f;   // Added a distinct color
  margin: 24px 0 16px 0;  // Adjusted margins
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Add these styled components for the explanation section
const ExplanationBox = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ExampleBox = styled.div`
  background: #f9f9f9;
  border-radius: 6px;
  padding: 12px;
  margin: 12px 0;
  font-size: 13px;
  color: #444;
  border-left: 3px solid #c5cae9;
`;

// Updated WeightingExplanation component with full content
const WeightingExplanation = () => {
  const [showExplanation, setShowExplanation] = useState(false);
  
  return (
    <span style={{ 
      position: 'relative', 
      display: 'inline-block',
      verticalAlign: 'middle' 
    }}>
      <HelpIconButton 
        onClick={() => setShowExplanation(!showExplanation)}
        onBlur={() => setTimeout(() => setShowExplanation(false), 200)}
      >
        ?
      </HelpIconButton>
      
      <ExplanationPopover $isVisible={showExplanation}>
        <ExplanationTitle>How Your Calibration Affects Results</ExplanationTitle>
        
        <ExplanationSection>
          The sliders you adjust here will personalize how the quiz evaluates each university 
          based on your perception of their strengths in each category.
        </ExplanationSection>
        
        <ExplanationTitle>How Scoring Works</ExplanationTitle>
        <ExplanationSection>
          When calculating which university best matches your values, the quiz:
          <ExplanationList>
            <li>Takes each of your responses (1-7 on the agreement scale)</li>
            <li>Multiplies it by the weightings you're setting here</li>
            <li>Applies mathematical transformations</li>
            <li>Sums these values across all questions</li>
          </ExplanationList>
        </ExplanationSection>
        
        <ExampleBox>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>Example</div>
          <div>If you rate schools differently for "Time & Efficiency":</div>
          <ul style={{ margin: '8px 0' }}>
            <li>UBC: 3.2/10</li>
            <li>McGill: 6.7/10</li>
            <li>Dublin: 8.5/10</li>
          </ul>
          
          <div style={{ marginTop: '12px' }}>
            And then strongly agree (7) with "I prefer a concise academic program," 
            the scores would be:
          </div>
          <ul style={{ margin: '8px 0' }}>
            <li>UBC: 7 × 3.2 = 22.4 points</li>
            <li>McGill: 7 × 6.7 = 46.9 points</li>
            <li>Dublin: 7 × 8.5 = 59.5 points</li>
          </ul>
          
          <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
            Dublin gets significantly more points because you rated it higher for time efficiency.
          </div>
        </ExampleBox>
        
        <ExplanationSection>
          This approach personalizes recommendations based on both <strong>what you value</strong> and 
          <strong> how you perceive each school's strengths</strong>.
        </ExplanationSection>
      </ExplanationPopover>
    </span>
  );
};

// Now add this component to your calibration UI section
// Near the top where you have the title and description:
<div>
  <SectionTitle>
    Calibrate Your University Weightings
    <WeightingExplanation />
  </SectionTitle>
  <InfoText>
    Help us understand how you think each university performs in different areas.
    Adjust the sliders based on your current knowledge of these programs.
  </InfoText>
  
  {/* Rest of your calibration UI */}
</div>

// Now update your GradSchoolQuiz component
const GradSchoolQuiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState<QuizQuestion[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [showCalibration, setShowCalibration] = useState(false);
  
  // Update the chartRef type to specifically match what Radar component expects
  const chartRef = useRef<any>(null);
  
  // Inside the GradSchoolQuiz component, add this state for calibration values
  const [calibrationValues, setCalibrationValues] = useState<{
    [category: string]: {
      ubc: number;
      mcgill: number;
      dublin: number;
    }
  }>({});
  
  // Initialize with default values when entering calibration mode
  useEffect(() => {
    if (showCalibration && Object.keys(calibrationValues).length === 0) {
      // Initialize all categories with default values
      const initialValues: {[key: string]: {ubc: number; mcgill: number; dublin: number}} = {};
      
      // Helper function to get default values for a category
      const getDefaultsForCategory = (category: string) => {
        // Get the first question in this category to extract default weightings
        const categoryKey = Object.keys(categoryMapping).find(
          key => categoryMapping[key] === category
        );
        
        if (!categoryKey) return { ubc: 5, mcgill: 5, dublin: 5 };
        
        const sampleQuestion = quizQuestions.find(q => q.category === categoryKey);
        return sampleQuestion?.weightings || { ubc: 5, mcgill: 5, dublin: 5 };
      };
      
      // Initialize all value categories
      valueCategories.forEach(category => {
        initialValues[category] = getDefaultsForCategory(category);
      });
      
      setCalibrationValues(initialValues);
      
      // For now, we'll only show Time & Efficiency, but we've prepared for all categories
      console.log("Initialized calibration values for all categories");
    }
  }, [showCalibration]);
  
  // Add state to track the current calibration category
  const [currentCalibrationCategory, setCurrentCalibrationCategory] = useState(0);
  
  // Add navigation functions for calibration
  const goToNextCategory = () => {
    if (currentCalibrationCategory < valueCategories.length - 1) {
      setCurrentCalibrationCategory(currentCalibrationCategory + 1);
    } else {
      // If we're at the last category, proceed to quiz
      setShowCalibration(false);
      setQuizStarted(true);
      applyCalibrationToQuestions();
    }
  };
  
  const goToPreviousCategory = () => {
    if (currentCalibrationCategory > 0) {
      setCurrentCalibrationCategory(currentCalibrationCategory - 1);
    } else {
      // If we're at the first category, go back to welcome screen
      setShowCalibration(false);
    }
  };
  
  // Set the initial tab when results are shown
  useEffect(() => {
    if (showResults && selectedTab === '') {
      const results = calculateResults();
      const sortedCategories = valueCategories
        .map(category => ({
          name: category,
          score: results.categoryScores[category] || 0
        }))
        .sort((a, b) => b.score - a.score);
      
      if (sortedCategories.length > 0) {
        setSelectedTab(sortedCategories[0].name);
      }
    }
  }, [showResults, selectedTab]);
  
  // Initialize randomized questions when quiz starts
  useEffect(() => {
    if (quizStarted && randomizedQuestions.length === 0) {
      // Fisher-Yates shuffle algorithm
      const shuffled = [...quizQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setRandomizedQuestions(shuffled);
    }
  }, [quizStarted]);
  
  // Calculate which questions to show (we can paginate by category or show individual questions)
  const currentQuestion = randomizedQuestions[currentStep];
  const progress = randomizedQuestions.length > 0 
    ? ((currentStep + 1) / randomizedQuestions.length) * 100 
    : 0;
  
  const handleResponse = (value: number) => {
    if (randomizedQuestions.length === 0) return;
    
    const currentQuestion = randomizedQuestions[currentStep];
    
    // Save or update response
    const existingIndex = responses.findIndex(r => r.questionId === currentQuestion.id);
    
    if (existingIndex >= 0) {
      const newResponses = [...responses];
      newResponses[existingIndex] = { 
        questionId: currentQuestion.id, 
        value
      };
      setResponses(newResponses);
    } else {
      setResponses([...responses, { 
        questionId: currentQuestion.id, 
        value
      }]);
    }
    
    // Automatically advance to next question
    if (currentStep < randomizedQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const getCurrentResponse = (): number | undefined => {
    const response = responses.find(r => r.questionId === currentQuestion?.id);
    return response?.value;
  };
  
  const goToNext = () => {
    if (currentStep < randomizedQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const calculateResults = () => {
    // Add logging at the start
    console.log('Calibration values being used:', calibrationValues);
    
    // Initialize scores
    let scores = { ubc: 0, mcgill: 0, dublin: 0 };
    let maxPossibleScore = { ubc: 0, mcgill: 0, dublin: 0 };
    
    // Log each response calculation
    responses.forEach(response => {
      const question = quizQuestions.find(q => q.id === response.questionId);
      if (!question) return;
      
      // Get the mapped category name
      const mappedCategory = categoryMapping[question.category];
      
      // Get calibrated weightings for this category
      const calibratedWeightings = calibrationValues[mappedCategory] || question.weightings;
      
      console.log('Processing response:', {
        questionId: question.id,
        category: mappedCategory,
        response: response.value,
        originalWeightings: question.weightings,
        calibratedWeightings: calibratedWeightings,
        calculation: {
          ubc: `${response.value} × ${calibratedWeightings.ubc} = ${response.value * calibratedWeightings.ubc}`,
          mcgill: `${response.value} × ${calibratedWeightings.mcgill} = ${response.value * calibratedWeightings.mcgill}`,
          dublin: `${response.value} × ${calibratedWeightings.dublin} = ${response.value * calibratedWeightings.dublin}`
        }
      });
      
      // Use calibrated weightings for score calculation
      scores.ubc += response.value * calibratedWeightings.ubc;
      scores.mcgill += response.value * calibratedWeightings.mcgill;
      scores.dublin += response.value * calibratedWeightings.dublin;
      
      // Update max possible scores using calibrated weightings
      maxPossibleScore.ubc += 7 * calibratedWeightings.ubc;
      maxPossibleScore.mcgill += 7 * calibratedWeightings.mcgill;
      maxPossibleScore.dublin += 7 * calibratedWeightings.dublin;
    });
    
    // Log final scores and calculations
    console.log('Final raw scores:', scores);
    console.log('Max possible scores:', maxPossibleScore);
    
    // Calculate raw percentages
    const rawPercentages = {
      ubc: (scores.ubc / maxPossibleScore.ubc) * 100,
      mcgill: (scores.mcgill / maxPossibleScore.mcgill) * 100,
      dublin: (scores.dublin / maxPossibleScore.dublin) * 100
    };
    
    // Apply a stretch function to amplify differences
    // This will make small differences appear larger
    const stretchPercentages = (percentages: {[key: string]: number}) => {
      const values = Object.values(percentages);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min || 1; // Avoid division by zero
      
      // Stretch the range to be between 40% and 95%
      const result: {[key: string]: number} = {};
      for (const key in percentages) {
        const normalized = (percentages[key] - min) / range; // 0 to 1
        result[key] = 40 + normalized * 55; // 40% to 95%
      }
      return result;
    };
    
    const stretchedPercentages = stretchPercentages(rawPercentages);
    
    // Calculate category scores
    const categoryScores: {[key: string]: {total: number, count: number}} = {};
    
    // Initialize categories
    valueCategories.forEach(category => {
      categoryScores[category] = {total: 0, count: 0};
    });
    
    // Sum responses by category
    responses.forEach(response => {
      const question = quizQuestions.find(q => q.id === response.questionId);
      if (!question) return;
      
      const mainCategory = categoryMapping[question.category] || question.category;
      
      if (categoryScores[mainCategory]) {
        categoryScores[mainCategory].total += response.value;
        categoryScores[mainCategory].count += 1;
      }
    });
    
    // Calculate averages and convert to percentages
    const normalizedCategoryScores: {[key: string]: number} = {};
    
    for (const category in categoryScores) {
      if (categoryScores[category].count > 0) {
        // Convert average (1-7) to percentage (0-100)
        const average = categoryScores[category].total / categoryScores[category].count;
        normalizedCategoryScores[category] = ((average - 1) / 6) * 100;
      } else {
        normalizedCategoryScores[category] = 0;
      }
    }
    
    // Add this logging
    console.log('Calibration values:', calibrationValues);
    console.log('Final scores:', scores);
    console.log('Raw percentages:', rawPercentages);
    console.log('Stretched percentages:', stretchedPercentages);
    
    return {
      scores: scores,
      percentages: stretchedPercentages,
      categoryScores: normalizedCategoryScores
    };
  };
  
  // Inside the GradSchoolQuiz component, add this function:
  const handleRandomDebug = () => {
    // Start the quiz if it hasn't already
    if (!quizStarted) {
      setQuizStarted(true);
      
      // Wait for questions to be randomized
      setTimeout(() => generateRandomAnswers(), 100);
      return;
    }
    
    generateRandomAnswers();
  };

  const generateRandomAnswers = () => {
    // Create random responses for all questions
    const randomResponses: UserResponse[] = quizQuestions.map(question => {
      // Generate a random number between 1 and 7
      const randomValue = Math.floor(Math.random() * 7) + 1;
      
      return {
        questionId: question.id,
        value: randomValue
      };
    });
    
    // Set the responses and show results
    setResponses(randomResponses);
    setShowResults(true);
  };

  // Add this function to generate category-specific justifications
  const getCategoryJustification = (schoolKey: string, category: string): string => {
    const justifications: {[key: string]: {[key: string]: string}} = {
      "Time & Efficiency": {
        ubc: "UBC's 2-year program is more time-intensive, providing a deeper educational experience but requiring a longer commitment.",
        mcgill: "McGill offers a balanced timeline, with opportunities to accelerate your studies while maintaining quality education.",
        dublin: "UCD's 1-year program is highly time-efficient, getting you into the workforce faster than other options."
      },
      "Cultural Exposure & International Experience": {
        ubc: "At UBC, you'll gain international perspective in a diverse Canadian setting with a strong Asian-Pacific influence.",
        mcgill: "McGill offers excellent cultural exposure in cosmopolitan Montreal, with its unique French-Canadian character.",
        dublin: "UCD provides complete immersion in Irish and European culture, offering the most distinct international experience."
      },
      "Family, Social Connections": {
        ubc: "UBC's west coast location means moderate distance from Toronto, requiring occasional flights to maintain connections.",
        mcgill: "McGill's Montreal location is closest to Toronto, making it easiest to maintain family and social connections.",
        dublin: "UCD requires the most significant adaptation to distance from existing social networks, but offers opportunities for new connections."
      },
      "Financial Investment & Risk": {
        ubc: "UBC represents a moderate financial investment with strong recognition across Canada and internationally.",
        mcgill: "McGill offers excellent value with relatively lower costs and strong career returns in the Canadian market.",
        dublin: "UCD may require additional steps for Canadian recognition, but offers potential savings through its shorter program."
      },
      "Personal Growth & Adventure": {
        ubc: "UBC excels in personal growth opportunities with its breathtaking natural setting and outdoor adventures.",
        mcgill: "McGill offers personal growth through its vibrant cultural scene and accessible East Coast adventures.",
        dublin: "UCD provides the most transformative adventure experience with immersion in European culture and travel opportunities."
      },
      "Reputation & Career Advancement": {
        ubc: "UBC holds outstanding reputation in planning and sustainability, with strong industry connections across Western Canada.",
        mcgill: "McGill's prestigious reputation opens doors throughout Eastern Canada and internationally.",
        dublin: "UCD offers unique international credentials but may require additional steps for maximum recognition in Canada."
      },
      "Practicality & Adaptability": {
        ubc: "UBC's program emphasizes practical applications in a growing urban environment with strong sustainability focus.",
        mcgill: "McGill balances theoretical excellence with practical applications in a diverse urban context.",
        dublin: "UCD offers hands-on experience in an international context with a focus on rapid skill development."
      },
      "Urban vs. Natural Environments": {
        ubc: "UBC offers an unmatched balance of urban amenities and natural beauty, with mountains and ocean at your doorstep.",
        mcgill: "McGill provides an excellent urban experience in Montreal with accessible outdoor activities nearby.",
        dublin: "UCD gives you a European urban experience with access to Ireland's beautiful countryside and coastline."
      },
      "Sustainability & Long-Term Impact": {
        ubc: "UBC is a global leader in sustainability research and practice, offering cutting-edge expertise in this field.",
        mcgill: "McGill provides strong sustainability focus with interdisciplinary programs addressing urban challenges.",
        dublin: "UCD offers European perspectives on sustainability and planning that contribute to a broader understanding of global challenges."
      }
    };
    
    return justifications[category]?.[schoolKey] || 
      "This school provides competitive opportunities in this category.";
  };

  // Inside the GradSchoolQuiz component, make sure to define the function 
  // before the render code (before the return statement)

  // Add this function to apply calibration values to questions at the top of your component
  const applyCalibrationToQuestions = () => {
    if (Object.keys(calibrationValues).length === 0) return;
    
    const updatedQuestions = [...quizQuestions].map(question => {
      const category = categoryMapping[question.category] || question.category;
      if (calibrationValues[category]) {
        return {
          ...question,
          weightings: {
            ubc: calibrationValues[category].ubc,
            mcgill: calibrationValues[category].mcgill,
            dublin: calibrationValues[category].dublin
          }
        };
      }
      return question;
    });
    
    // Actually use the updated questions
    setRandomizedQuestions(updatedQuestions);
  };



  // Quiz content
  const renderQuiz = () => {
    // If questions haven't been randomized yet, show loading
    if (randomizedQuestions.length === 0) {
      return <div>Loading questions...</div>;
    }
    
    if (showResults) {
      const results = calculateResults();
      
      // Helper function to toggle category expansion
      const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
          ...prev,
          [category]: !prev[category]
        }));
      };
      
      // Get all questions for a specific category
      const getCategoryQuestions = (category: string) => {
        return responses.map(response => {
          const question = quizQuestions.find(q => q.id === response.questionId);
          if (!question) return null;
          
          const mainCategory = categoryMapping[question.category] || question.category;
          
          if (mainCategory === category) {
            return {
              text: question.text,
              value: response.value,
              valueText: likertOptions[response.value - 1],
              weightings: question.weightings,
              category: question.category  // Add this line to include the category
            };
          }
          return null;
        }).filter(item => item !== null);
      };
      
      // Sort value categories by score (highest first)
      const sortedCategories = valueCategories
        .map(category => ({
          name: category,
          abbr: categoryAbbreviations[category] || category.substring(0, 3),
          score: results.categoryScores[category] || 0,
          questions: getCategoryQuestions(category)
        }))
        .sort((a, b) => b.score - a.score);
      
      // Sort schools by match percentage
      const sortedSchools = [
        { name: "University of British Columbia", key: "ubc", percentage: results.percentages.ubc },
        { name: "McGill University", key: "mcgill", percentage: results.percentages.mcgill },
        { name: "University College Dublin", key: "dublin", percentage: results.percentages.dublin }
      ].sort((a, b) => b.percentage - a.percentage);
      
      const getSchoolAnalysis = (schoolKey: string) => {
        switch(schoolKey) {
          case 'ubc':
            return "UBC offers a balance of sustainability, adventure, and career impact. With mountains and ocean nearby, it's ideal for nature lovers. The 2-year program is longer but provides strong accreditation for Canadian careers.";
          case 'mcgill':
            return "McGill provides proximity to Toronto, making it easier to maintain your relationship and family connections. It has strong academic reputation in Canada and is accredited for planning careers, with a vibrant Montreal culture.";
          case 'dublin':
            return "UCD offers the fastest path to graduation with its 1-year program. It provides maximum international experience and cultural exposure, though it's the furthest from Toronto and may require additional steps for Canadian accreditation.";
          default:
            return "";
        }
      };
      
      // Create a radar chart for the values profile
      const valueScores = sortedCategories.map(category => Math.round(category.score));
      const valueLabels = sortedCategories.map(category => category.abbr);

      const chartData = {
        labels: valueLabels,
        datasets: [
          {
            label: 'Your Values Profile',
            data: valueScores,
            backgroundColor: 'rgba(92, 107, 192, 0.2)',
            borderColor: 'rgba(92, 107, 192, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(92, 107, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(92, 107, 192, 1)',
          }
        ]
      };

      const chartOptions = {
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              font: {
                weight: 'bold' as const
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems: any) => {
                // Return the full category name in the tooltip
                const index = tooltipItems[0].dataIndex;
                return sortedCategories[index].name;
              }
            }
          }
        }
      };
      
      // First, get the top 3 categories for the user
      const topCategories = sortedCategories.slice(0, 3).map(cat => cat.name);
      const bestSchool = sortedSchools[0];

      return (
        <ResultsContainer>
          <SectionTitle>Your Values Profile</SectionTitle>
          <InfoText>
            Based on your responses, here's how you prioritize different aspects of your graduate education.
    
          </InfoText>
          
          <ChartContainer>
            <Radar 
              ref={chartRef}
              data={chartData} 
              options={{
                ...chartOptions,
                onClick: (event) => {
                  if (!chartRef.current) return;
                  
                  // Get clicked elements
                  const points = chartRef.current.getElementsAtEventForMode(
                    event.native as Event, 
                    'nearest', 
                    { intersect: true }, 
                    false
                  );
                  
                  // If we clicked on a point
                  if (points.length) {
                    const firstPoint = points[0];
                    const index = firstPoint.index;
                    
                    // Instead of selecting a tab, toggle the expansion
                    if (index >= 0 && index < sortedCategories.length) {
                      toggleCategory(sortedCategories[index].name);
                    }
                  }
                }
              }} 
            />
          </ChartContainer>
          
          
          <CategoryList>
            {sortedCategories.map((category, index) => (
              <CategoryListItem key={category.name}>
                <CategoryHeader 
                  $colorIndex={index}
                  onClick={() => toggleCategory(category.name)}
                >
                  <CategoryTitle>
                    <CategoryAbbr>{category.abbr}</CategoryAbbr>
                    {category.name}
                  </CategoryTitle>
                  <CategoryScore>{Math.round(category.score)}%</CategoryScore>
                </CategoryHeader>
                
                <ExpandableCategoryContent $isOpen={!!expandedCategories[category.name]}>
                  <CategoryQuestions>
                    {category.questions?.length === 0 ? (
                      <p>No questions in this category</p>
                    ) : (
                      category.questions?.map((q, i) => (
                        <QuestionItem key={i}>
                          <DetailQuestionText>{q?.text}</DetailQuestionText>
                          <ResponseValue $value={q?.value || 1}>
                            {q?.value}
                          </ResponseValue>
                          <ResponseLabel>{q?.valueText}</ResponseLabel>
                          
                          {/* Update the weightings display */}
                          <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                            <div>Applied weightings:</div>
                            <div>UBC: {(q?.category && calibrationValues[categoryMapping[q.category]]?.ubc || q?.weightings?.ubc || 5).toFixed(1)}/10</div>
                            <div>McGill: {(q?.category && calibrationValues[categoryMapping[q.category]]?.mcgill || q?.weightings?.mcgill || 5).toFixed(1)}/10</div>
                            <div>UCD: {(q?.category && calibrationValues[categoryMapping[q.category]]?.dublin || q?.weightings?.dublin || 5).toFixed(1)}/10</div>
                          </div>
                        </QuestionItem>
                      ))
                    )}
                  </CategoryQuestions>
                </ExpandableCategoryContent>
              </CategoryListItem>
            ))}
          </CategoryList>
          
          <SectionTitle>Your Best Program Match</SectionTitle>
          
          {sortedSchools.map((school, index) => {
            // Only show top match large, others smaller
            if (index === 0) {
              return (
                <ResultCard key={school.key}>
                  <CategoryHeading>BEST MATCH</CategoryHeading>
                  <ResultSchoolName>{school.name}</ResultSchoolName>
                  <MatchBar>
                    <MatchFill $percentage={school.percentage} />
                  </MatchBar>
                  <MatchPercentage>{Math.round(school.percentage)}% Match</MatchPercentage>
                  
                  <InfoText style={{textAlign: 'left', marginTop: '15px'}}>
                    {getSchoolAnalysis(school.key)}
                  </InfoText>
                  
                  {/* Add category justifications */}
                  <KeyFactorsContainer>
                    <KeyFactorTitle>How Your Top Values Match This School</KeyFactorTitle>
                    <div style={{marginTop: '15px'}}>
                      {topCategories.map((category, index) => (
                        <div key={index} style={{marginBottom: '15px'}}>
                          <div style={{
                            fontWeight: 'bold', 
                            display: 'flex', 
                            alignItems: 'center',
                            marginBottom: '4px'
                          }}>
                            <span style={{
                              display: 'inline-block',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: ['#3949ab', '#43a047', '#e53935'][index % 3],
                              color: 'white',
                              textAlign: 'center',
                              lineHeight: '24px',
                              marginRight: '8px',
                              fontSize: '14px',
                              fontWeight: 'bold'
                            }}>{index + 1}</span>
                            {category} <span style={{
                              fontSize: '13px',
                              color: '#666',
                              fontWeight: 'normal',
                              marginLeft: '8px'
                            }}>({Math.round(sortedCategories.find(c => c.name === category)?.score || 0)}%)</span>
                          </div>
                          <div style={{marginLeft: '32px', color: '#555', fontSize: '15px'}}>
                            {getCategoryJustification(school.key, category)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </KeyFactorsContainer>
                </ResultCard>
              );
            } else {
              // Smaller display for other matches
              return (
                <div key={school.key} style={{display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
                  <div>{school.name}</div>
                  <div><strong>{Math.round(school.percentage)}%</strong> Match</div>
                </div>
              );
            }
          })}
          
          <InfoText>
            Remember, this quiz is just one tool to help with your decision. Many factors may not be captured here, and you should trust your intuition as well!
          </InfoText>
          
          <RestartButton onClick={() => {
            // Reset quiz state
            setQuizStarted(false);
            setCurrentStep(0);
            setResponses([]);
            setShowResults(false);
            setRandomizedQuestions([]);
            
            // Reset calibration values
            setCalibrationValues({});
            
            // Reset category position
            setCurrentCalibrationCategory(0);
            
            // Show calibration screen
            setShowCalibration(true);
          }}>
            Take Quiz Again
          </RestartButton>
        </ResultsContainer>
      );
    }
    
    return (
      <>
        <ProgressBar>
          <ProgressFill $percentage={progress} />
        </ProgressBar>
        
        <QuestionCard>
          <CategoryHeading>{currentQuestion.category}</CategoryHeading>
          <QuestionText>{currentQuestion.text}</QuestionText>
          
          <OptionGrid>
            {likertOptions.map((option, index) => (
              <Option 
                key={index}
                $selected={getCurrentResponse() === index + 1}
                onClick={() => handleResponse(index + 1)}
              >
                {option}
              </Option>
            ))}
          </OptionGrid>
        </QuestionCard>
        
        <NavigationButtons>
          <NavButton 
            onClick={goToPrevious}
            disabled={currentStep === 0}
          >
            Previous
          </NavButton>
          
          <NavButton onClick={goToNext}>
            {currentStep < randomizedQuestions.length - 1 ? 'Skip' : 'See Results'}
          </NavButton>
        </NavigationButtons>
        
        {/* Add debug button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <DebugButton onClick={handleRandomDebug}>
            Debug: Skip to Results with Random Answers
          </DebugButton>
        </div>
      </>
    );
  };

  // Prepare category descriptions for all categories
  const categoryDescriptions: {[key: string]: string} = {
    "Time & Efficiency": "This category measures how quickly a program allows you to complete your education and enter the workforce. Programs with shorter durations, focused curricula, and streamlined learning experiences score higher.",
    
    "Cultural Exposure & Experience": "This category evaluates the opportunity to immerse yourself in a different cultural environment and gain new perspectives. Programs that provide diverse cultural settings and experiences score higher.", // Updated key and description
    
    "Family, Social Connections": "This category assesses how well a program allows you to maintain close relationships with family and friends. Programs that are geographically closer to your personal connections or provide better work-life balance score higher.",
    
    "Financial Investment & Risk": "This category considers the financial aspects of your education, including tuition, living costs, and potential return on investment. Programs with better value, scholarship opportunities, or stronger financial outcomes score higher.",
    
    "Personal Growth & Adventure": "This category evaluates opportunities for personal development, self-discovery, and adventure. Programs that push you outside your comfort zone, offer unique experiences, or provide transformative growth opportunities score higher.",
    
    "Reputation & Career Advancement": "This category measures the prestige and professional recognition of the institution and program. Programs with stronger industry connections, alumni networks, and recognized credentials that advance your career score higher.",
    
    "Practicality & Adaptability": "This category assesses how well a program balances theoretical knowledge with practical skills and adaptable learning. Programs that emphasize real-world applications, industry-relevant projects, and flexible skill development score higher.",
    
    "Urban vs. Natural Environments": "This category evaluates the physical setting of the program and its surroundings. Programs score differently based on your preference for urban conveniences, natural landscapes, or a balance between city life and outdoor activities.",
    
    "Sustainability & Long-Term Impact": "This category considers a program's focus on environmental sustainability, social responsibility, and long-term impact. Programs with stronger sustainability initiatives, research, and curriculum integration score higher."
  };

  // Add this styled component with your other styled components
  const ResetButton = styled.button`
    background: none;
    border: 1px solid #c5cae9;
    color: #3949ab;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f5f7ff;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `;

  return (
    <ModernContainer>
      <ModernHeader>
        <BackLink to="/">← Back to Home</BackLink>
        <ModernTitle>Maggie's Grad School Match Finder</ModernTitle>
      </ModernHeader>
      
      <MainContent>
        {!quizStarted && !showCalibration ? (
          // Welcome screen - only show when neither quiz nor calibration are active
          <WelcomeSection>
            <SectionTitle>Find Your Perfect Grad School Match</SectionTitle>
            <InfoText>
              Hi Maggie! I'm really excited for this big decision. It's a really stressful decision to make and I hope this quiz helps you distill your thoughts down and make your decision feel good! There are no wrong answers!
              I love you so much!!!!
            </InfoText>
          
            <StartButton onClick={() => setShowCalibration(true)}>
              Let's Get Started
            </StartButton>
            
            <div style={{ marginTop: '30px' }}>
              <DebugButton onClick={handleRandomDebug}>
                Debug: Generate Random Answers
              </DebugButton>
            </div>
          </WelcomeSection>
        ) : showCalibration ? (
          // Calibration screen - show when calibration is active
          <div>
            <SectionTitle>Calibrate Your University Weightings</SectionTitle>
            
            <ExplanationBox>
              <ExplanationTitle>How Your Calibration Affects Results</ExplanationTitle>
              
              <InfoText>
                The sliders you adjust here will personalize how the quiz evaluates each university 
                based on your perception of their strengths in each category.
              </InfoText>
              
              <ExplanationTitle>How Scoring Works</ExplanationTitle>
              <InfoText>
                When calculating which university best matches your values, the quiz:
                <ul style={{ marginTop: '8px', marginBottom: '12px', paddingLeft: '32px' }}>
                  <li>Takes each of your responses (1-7 on the agreement scale)</li>
                  <li>Multiplies it by the weightings you're setting here</li>
                  <li>Applies mathematical transformations</li>
                  <li>Sums these values across all questions</li>
                </ul>
              </InfoText>
              
              <ExampleBox>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>Example</div>
                <div>If you rate schools differently for "Time & Efficiency":</div>
                <ul style={{ margin: '8px 0', paddingLeft: '32px' }}>
                  <li>UBC: 3.2/10</li>
                  <li>McGill: 6.7/10</li>
                  <li>Dublin: 8.5/10</li>
                </ul>
                
                <div style={{ marginTop: '12px' }}>
                  And then strongly agree (7) with "I prefer a concise academic program," 
                  the scores would be:
                </div>
                <ul style={{ margin: '8px 0', paddingLeft: '32px' }}>
                  <li>UBC: 7 × 3.2 = 22.4 points</li>
                  <li>McGill: 7 × 6.7 = 46.9 points</li>
                  <li>Dublin: 7 × 8.5 = 59.5 points</li>
                </ul>
                
                <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                  Dublin gets significantly more points because you rated it higher for time efficiency.
                </div>
              </ExampleBox>
              
              <InfoText style={{ marginTop: '12px' }}>
                This approach personalizes recommendations based on both <strong>what you value</strong> and 
                <strong> how you perceive each school's strengths</strong>.
              </InfoText>
            </ExplanationBox>

            <CalibrationContainer>
              {/* Get the current category */}
              {(() => {
                const category = valueCategories[currentCalibrationCategory];
                return (
                  <CategoryCalibration>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <CategoryHeading>{category.toUpperCase()}</CategoryHeading>
                      <ResetButton
                        onClick={() => {
                          // Get default values for this category from the first matching question
                          const categoryKey = Object.keys(categoryMapping).find(
                            key => categoryMapping[key] === category
                          );
                          const sampleQuestion = categoryKey 
                            ? quizQuestions.find(q => q.category === categoryKey)
                            : null;
                          
                          const defaultValues = sampleQuestion?.weightings || { ubc: 5, mcgill: 5, dublin: 5 };
                          
                          // Update the calibration values for this category only
                          setCalibrationValues(prev => ({
                            ...prev,
                            [category]: defaultValues
                          }));
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>↺</span> Reset to Defaults
                      </ResetButton>
                    </div>
                    
                    <CategoryDescription>
                      {categoryDescriptions[category] || 
                        "How well does each university perform in this category?"}
                    </CategoryDescription>
                    
                    {/* Slider for UBC */}
                    <SliderContainer>
                      <SliderLabelContainer>
                        <SchoolLabel>University of British Columbia</SchoolLabel>
                        {/* Removed the exact value display */}
                      </SliderLabelContainer>
                      <StyledSlider 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="0.1" // Allow decimal values for smoother movement
                        value={calibrationValues[category]?.ubc || 5}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          setCalibrationValues(prev => ({
                            ...prev,
                            [category]: {
                              ...prev[category],
                              ubc: newValue
                            }
                          }));
                        }}
                      />
                      <SliderEndLabels>
                        <span>Less Strong</span>
                        <span>Very Strong</span>
                      </SliderEndLabels>
                    </SliderContainer>
                    
                    {/* Slider for McGill */}
                    <SliderContainer>
                      <SliderLabelContainer>
                        <SchoolLabel>McGill University</SchoolLabel>
                        {/* Removed the exact value display */}
                      </SliderLabelContainer>
                      <StyledSlider 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="0.1" // Allow decimal values for smoother movement
                        value={calibrationValues[category]?.mcgill || 5}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          setCalibrationValues(prev => ({
                            ...prev,
                            [category]: {
                              ...prev[category],
                              mcgill: newValue
                            }
                          }));
                        }}
                      />
                      <SliderEndLabels>
                        <span>Less Strong</span>
                        <span>Very Strong</span>
                      </SliderEndLabels>
                    </SliderContainer>
                    
                    {/* Slider for UCD */}
                    <SliderContainer>
                      <SliderLabelContainer>
                        <SchoolLabel>University College Dublin</SchoolLabel>
                        {/* Removed the exact value display */}
                      </SliderLabelContainer>
                      <StyledSlider 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="0.1" // Allow decimal values for smoother movement
                        value={calibrationValues[category]?.dublin || 5}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          setCalibrationValues(prev => ({
                            ...prev,
                            [category]: {
                              ...prev[category],
                              dublin: newValue
                            }
                          }));
                        }}
                      />
                      <SliderEndLabels>
                        <span>Less Strong</span>
                        <span>Very Strong</span>
                      </SliderEndLabels>
                    </SliderContainer>
                  </CategoryCalibration>
                );
              })()}
              
              {/* Progress indicator */}
              <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <div style={{ marginBottom: '10px', color: '#666' }}>
                  {currentCalibrationCategory + 1} of {valueCategories.length} categories
                </div>
                <CalibrationProgressBar>
                  <CalibrationProgressFill 
                    $percentage={(currentCalibrationCategory + 1) / valueCategories.length * 100} 
                  />
                </CalibrationProgressBar>
              </div>
            </CalibrationContainer>
            
            <NavigationButtons>
              <NavButton onClick={goToPreviousCategory}>
                {currentCalibrationCategory === 0 ? 'Back' : 'Previous Category'}
              </NavButton>
              
              <NavButton onClick={goToNextCategory}>
                {currentCalibrationCategory < valueCategories.length - 1 
                  ? 'Next Category' 
                  : 'Continue to Quiz'}
              </NavButton>
            </NavigationButtons>
          </div>
        ) : (
          // The existing quiz or results - show when quiz is started
          renderQuiz()
        )}
      </MainContent>
    </ModernContainer>
  );
};

export default GradSchoolQuiz; 