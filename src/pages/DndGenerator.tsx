import React, { useState } from 'react';
import styled from 'styled-components';
import { AppPageContainer } from '../components/SharedStyles';

// Data constants
const RACES = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 
  'Tiefling', 'Half-Elf', 'Half-Orc', 'Gnome'
];

const CLASSES = [
  'Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger',
  'Paladin', 'Barbarian', 'Bard', 'Druid', 'Monk',
  'Sorcerer', 'Warlock'
];

// Setting options for the next step
const ENVIRONMENTS = [
  'Bustling Port City', 'Mountain Mining Town', 'Desert Trading Post',
  'Forest Village', 'Underground Dwarven City', 'Floating Sky City',
  'Coastal Fishing Village', 'Frontier Settlement', 'Dense Forest',
  'Frozen Tundra', 'Scorching Desert', 'Treacherous Mountains',
  'Swamplands', 'Volcanic Badlands', 'Rolling Plains',
  'Jungle Ruins', 'Ancient Ruins', 'Magical Academy',
  'Thieves\' Guild Network', 'Noble\'s Estate', 'Sacred Temple Grounds',
  'Abandoned Mine', 'Mysterious Island', 'Planar Crossroads'
];

const POLITICAL_SYSTEMS = [
  'Absolute Monarchy',
  'Feudal System',
  'City-State Republic',
  'Magocracy',
  'Theocracy',
  'Merchant Council',
  'Tribal Federation',
  'Military Dictatorship',
  'Anarchic Territory',
  'Noble Houses',
  'Democratic Council',
  'Druidic Circle Leadership'
];

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

const TECH_LEVELS = [
  'Stone Age',
  'Bronze Age',
  'Iron Age',
  'Medieval',
  'Renaissance',
  'Early Industrial',
  'Magipunk'
];

const MAGIC_LEVELS = [
  'No Magic',
  'Low Magic (Rare and Feared)',
  'Moderate Magic (Uncommon but Accepted)',
  'High Magic (Common and Integrated)',
  'Very High Magic (Shapes Society)',
  'Wild Magic (Unpredictable and Dangerous)'
];

// Add weather options to our constants
const WEATHER_CONDITIONS = [
  'Clear Skies',
  'Light Rain',
  'Heavy Storm',
  'Foggy',
  'Windy',
  'Scorching Heat',
  'Bitter Cold',
  'Supernatural Storm',
  'Magical Atmosphere',
  'Misty',
  'Overcast',
  'Perfect Day'
];

// Adventure Generator Constants
const CONFLICT_TYPES: string[] = [
  'Rescue Mission',
  'Heist/Theft',
  'Investigation/Mystery',
  'Protection/Defense',
  'Monster Hunt',
  'Race Against Time',
  'Dungeon Delve',
  'Political Intrigue',
  'Natural Disaster',
  'Revenge Plot'
];

const ANTAGONIST_TYPES: string[] = [
  'Corrupt Noble',
  'Dark Cultist',
  'Monster Leader',
  'Evil Spellcaster',
  'Criminal Mastermind',
  'Ancient Evil',
  'Rival Adventurer',
  'Possessed Ally',
  'Dragon',
  'Demon/Devil',
  'Mad Scientist/Artificer',
  'Misguided Zealot'
];

const STAKES: string[] = [
  'Innocent Lives at Risk',
  'Powerful Artifact in Wrong Hands',
  'Impending Ritual/Ceremony',
  'Stolen Royal Treasure',
  'Threatened Community',
  'Personal Revenge',
  'Prevent War/Conflict',
  'Stop Plague/Curse',
  'Race for Discovery',
  'Prevent Prophecy'
];

const COMPLICATIONS: string[] = [
  'Hidden Traitor',
  'Time Limit',
  'Moral Dilemma',
  'Innocent Hostages',
  'Competing Parties',
  'Environmental Hazards',
  'Limited Resources',
  'Magical Curse',
  'Political Pressure',
  'False Information'
];

const PLOT_TWISTS: string[] = [
  'Villain is Actually Right',
  'Supposed Ally is True Villain',
  'Multiple Antagonists Working Together',
  'Mission was a Setup',
  'Target/Goal Isn\'t What it Seems',
  'Villain is Related to Party Member',
  'Two Conflicts are Connected',
  'Good Guy was Bad All Along',
  'Everything is Part of Larger Plot',
  'Mistaken Identity'
];

const MACGUFFINS: string[] = [
  'Ancient Artifact',
  'Magical Weapon',
  'Sacred Relic',
  'Royal Heirloom',
  'Spellbook',
  'Key to Sealed Evil',
  'Proof of Conspiracy',
  'Rare Resource',
  'Missing Person',
  'Secret Information'
];

const LOCATION_SIGNIFICANCE: string[] = [
  'Ancient Burial Ground',
  'Seat of Power',
  'Sacred Site',
  'Magical Nexus',
  'Historical Battlefield',
  'Prophesied Location',
  'Natural Wonder',
  'Planar Gateway',
  'Lost City',
  'Cursed Ground'
];

const TIME_PRESSURE: string[] = [
  'Upcoming Festival/Celebration',
  'Astronomical Event',
  'Deadline for Ritual',
  'Impending Natural Disaster',
  'Political Summit',
  'Before Target Escapes',
  'Racing Against Rivals',
  'Before Curse Takes Effect',
  'Doomsday Clock',
  'Limited Window of Opportunity'
];

interface PartyMember {
  race: string;
  class: string;
}

interface PartyComposition {
  size: number;
  members: PartyMember[];
  setting: string;
}

interface Adventure {
  hook: string;
  location: string;
  villain: string;
  objective: string;
  twist: string;
  reward: string;
  encounters: string[];
  npcs: NPC[];
}

interface NPC {
  name: string;
  race: string;
  occupation: string;
  personality: string;
  motivation: string;
}

type GeneratorStep = 'party' | 'setting' | 'adventure';

interface AdventureSettings {
  conflictType: string;
  antagonistType: string;
  stakes: string;
  complications: string;
  plotTwist: string;
  macguffin: string;
  locationSignificance: string;
  timePressure: string;
}

const Container = styled(AppPageContainer)`
  background: white;
  color: black;
  font-family: 'Times New Roman', Times, serif;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid black;
  justify-content: space-between;
  width: 100%;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TopButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.$isActive ? '#eee' : 'white'};
  color: black;
  border: 1px solid black;
  border-bottom: none;
  cursor: pointer;
  font-family: 'Times New Roman', Times, serif;
  font-size: 1rem;
  
  &:hover {
    background: #eee;
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 1rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    color: black;
    border-bottom: 1px solid black;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.5em;
    font-family: 'Times New Roman', Times, serif;
  }

  h3 {
    color: black;
    margin-bottom: 0.5rem;
    font-size: 1.1em;
    font-family: 'Times New Roman', Times, serif;
  }

  label {
    color: black;
    font-size: 1em;
    margin-bottom: 0.5rem;
    display: block;
    font-family: 'Times New Roman', Times, serif;
  }
`;

const Select = styled.select`
  padding: 0.25rem;
  margin-bottom: 0.5rem;
  border: 1px solid black;
  background: white;
  color: black;
  width: 100%;
  font-family: 'Times New Roman', Times, serif;
  font-size: 1rem;
`;

const Button = styled.button`
  background: white;
  color: black;
  padding: 0.25rem 0.5rem;
  border: 1px solid black;
  cursor: pointer;
  margin: 0.25rem;
  font-family: 'Times New Roman', Times, serif;
  font-size: 1rem;

  &:hover {
    background: #eee;
  }
`;

const PartyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
`;

const PartyMemberCard = styled.div`
  padding: 0;
  margin-bottom: 0;
  
  h3 {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  select {
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
    padding: 0.15rem;
  }
`;

const AdventureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
`;

const SelectElement = styled(Select)`
  margin-bottom: 0;
  flex: 1;
`;

const SquareRandomButton = styled(Button)`
  padding: 0;
  margin: 0;
  aspect-ratio: 1;
  height: 1.8rem; // This should match your select height
  width: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CategorySection = styled.div`
  padding: 0;
  margin-bottom: 0;
  
  h3 {
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }
`;

const RandomizeCategoryButton = styled(Button)`
  padding: 0.25rem 0.5rem;
  margin: 0;
`;

const SummarySection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid black;
`;

const SummaryTitle = styled.h3`
  border-bottom: 1px solid black;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const CategoryContent = styled.div`
  padding-left: 1rem;
  
  div {
    margin-bottom: 0.25rem;
  }
`;

const RandomizeAllButton = styled(Button)`
  
  background: white;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  
  label {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

// Update RandomizeButton to match the basic style
const RandomizeButton = styled(Button)`
  background: white;
  
  &:hover {
    background: #eee;
  }
`;

const BottomButtonGroup = styled(ButtonGroup)`
  grid-column: 1 / -1;
  justify-content: center;
  margin-top: 1rem;
`;

const SummaryCategory = styled.div`
  margin: 1rem 0;
  padding: 0.5rem;
`;

const CategoryTitle = styled.h4`
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid black;
  padding-bottom: 0.25rem;
`;

// Add a new styled component for the back button
const BackButton = styled(Button)`
  margin: 0 1rem 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DndGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'party' | 'setting' | 'adventure'>('party');
  const [partySize, setPartySize] = useState<number | ''>('');
  const [party, setParty] = useState<PartyMember[]>([]);
  
  // Setting state
  const [selectedSettings, setSelectedSettings] = useState({
    environment: '',
    politicalSystem: '',
    season: '',
    weather: '',
    techLevel: '',
    magicLevel: ''
  });

  const [adventureSettings, setAdventureSettings] = useState<AdventureSettings>({
    conflictType: '',
    antagonistType: '',
    stakes: '',
    complications: '',
    plotTwist: '',
    macguffin: '',
    locationSignificance: '',
    timePressure: ''
  });

  const generateRandomPartyMember = (): PartyMember => ({
    race: RACES[Math.floor(Math.random() * RACES.length)],
    class: CLASSES[Math.floor(Math.random() * CLASSES.length)]
  });

  const handlePartySizeChange = (size: number | '') => {
    setPartySize(size);
    if (typeof size === 'number') {
      setParty(Array(size).fill(null).map(() => ({
        race: 'random',
        class: 'random'
      })));
    } else {
      setParty([]); // Clear party when no size is selected
    }
  };

  const updatePartyMember = (index: number, field: 'race' | 'class', value: string) => {
    const newParty = [...party];
    newParty[index] = { ...newParty[index], [field]: value };
    setParty(newParty);
  };

  const randomizeParty = () => {
    // Use selected party size or default to 3
    const size = typeof partySize === 'number' ? partySize : 3;
    setPartySize(size);
    
    const newParty = Array.from({ length: size }, () => ({
      race: RACES[Math.floor(Math.random() * RACES.length)],
      class: CLASSES[Math.floor(Math.random() * CLASSES.length)]
    }));
    setParty([...newParty]);
  };

  const randomizeAll = () => {
    // Use selected party size or default to 3
    const size = typeof partySize === 'number' ? partySize : 3;
    setPartySize(size);
    
    // Randomize party
    const newParty = Array.from({ length: size }, () => ({
      race: RACES[Math.floor(Math.random() * RACES.length)],
      class: CLASSES[Math.floor(Math.random() * CLASSES.length)]
    }));
    setParty([...newParty]);

    // Randomize world settings
    setSelectedSettings({
      environment: ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)],
      politicalSystem: POLITICAL_SYSTEMS[Math.floor(Math.random() * POLITICAL_SYSTEMS.length)],
      season: SEASONS[Math.floor(Math.random() * SEASONS.length)],
      weather: WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)],
      techLevel: TECH_LEVELS[Math.floor(Math.random() * TECH_LEVELS.length)],
      magicLevel: MAGIC_LEVELS[Math.floor(Math.random() * MAGIC_LEVELS.length)]
    });

    // Randomize adventure settings
    setAdventureSettings({
      conflictType: CONFLICT_TYPES[Math.floor(Math.random() * CONFLICT_TYPES.length)],
      antagonistType: ANTAGONIST_TYPES[Math.floor(Math.random() * ANTAGONIST_TYPES.length)],
      stakes: STAKES[Math.floor(Math.random() * STAKES.length)],
      complications: COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)],
      plotTwist: PLOT_TWISTS[Math.floor(Math.random() * PLOT_TWISTS.length)],
      macguffin: MACGUFFINS[Math.floor(Math.random() * MACGUFFINS.length)],
      locationSignificance: LOCATION_SIGNIFICANCE[Math.floor(Math.random() * LOCATION_SIGNIFICANCE.length)],
      timePressure: TIME_PRESSURE[Math.floor(Math.random() * TIME_PRESSURE.length)]
    });
  };

  const moveToSettings = () => {
    if (party.every(member => member.race !== 'random' && member.class !== 'random')) {
      setActiveTab('setting');
    } else {
      // Maybe show a warning that all party members need to be defined
      alert('Please finish creating your party before continuing!');
    }
  };

  const randomizeSetting = () => {
    setSelectedSettings({
      environment: ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)],
      politicalSystem: POLITICAL_SYSTEMS[Math.floor(Math.random() * POLITICAL_SYSTEMS.length)],
      season: SEASONS[Math.floor(Math.random() * SEASONS.length)],
      weather: WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)],
      techLevel: TECH_LEVELS[Math.floor(Math.random() * TECH_LEVELS.length)],
      magicLevel: MAGIC_LEVELS[Math.floor(Math.random() * MAGIC_LEVELS.length)]
    });
  };

  const randomizeCategory = (category: keyof AdventureSettings, options: string[]) => {
    setAdventureSettings(prev => ({
      ...prev,
      [category]: options[Math.floor(Math.random() * options.length)]
    }));
  };

  const randomizeAllAdventure = () => {
    setAdventureSettings({
      conflictType: CONFLICT_TYPES[Math.floor(Math.random() * CONFLICT_TYPES.length)],
      antagonistType: ANTAGONIST_TYPES[Math.floor(Math.random() * ANTAGONIST_TYPES.length)],
      stakes: STAKES[Math.floor(Math.random() * STAKES.length)],
      complications: COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)],
      plotTwist: PLOT_TWISTS[Math.floor(Math.random() * PLOT_TWISTS.length)],
      macguffin: MACGUFFINS[Math.floor(Math.random() * MACGUFFINS.length)],
      locationSignificance: LOCATION_SIGNIFICANCE[Math.floor(Math.random() * LOCATION_SIGNIFICANCE.length)],
      timePressure: TIME_PRESSURE[Math.floor(Math.random() * TIME_PRESSURE.length)]
    });
  };

  const clearCategory = (category: keyof AdventureSettings) => {
    setAdventureSettings(prev => ({
      ...prev,
      [category]: ''
    }));
  };

  // Add these helper functions
  const randomizePartyMember = (index: number, field: 'race' | 'class') => {
    const options = field === 'race' ? RACES : CLASSES;
    updatePartyMember(index, field, options[Math.floor(Math.random() * options.length)]);
  };

  const randomizeSingleSetting = (setting: keyof typeof selectedSettings, options: string[]) => {
    setSelectedSettings(prev => ({
      ...prev,
      [setting]: options[Math.floor(Math.random() * options.length)]
    }));
  };

  const clearParty = () => {
    setPartySize('');
    setParty([]);
  };

  const clearSettings = () => {
    setSelectedSettings({
      environment: '',
      politicalSystem: '',
      season: '',
      weather: '',
      techLevel: '',
      magicLevel: ''
    });
  };

  // Add clearAll function
  const clearAll = () => {
    clearParty();
    clearSettings();
    setAdventureSettings({
      conflictType: '',
      antagonistType: '',
      stakes: '',
      complications: '',
      plotTwist: '',
      macguffin: '',
      locationSignificance: '',
      timePressure: ''
    });
  };

  // Update the party creation render function
  const renderPartyCreation = () => (
    <Section>
      <div>
        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Party Size
          <RandomizeCategoryButton 
            onClick={() => handlePartySizeChange(Math.floor(Math.random() * 6) + 1)}
          >
            🎲 Random
          </RandomizeCategoryButton>
        </h3>
        <Select
          value={partySize}
          onChange={(e) => handlePartySizeChange(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <option value="">Select Party Size</option>
          {[1,2,3,4,5,6].map(size => (
            <option key={size} value={size}>{size} members</option>
          ))}
        </Select>
      </div>

      {partySize !== '' && (
        <PartyGrid>
          {party.map((member, index) => (
            <PartyMemberCard key={index}>
              <h3>Member {index + 1}</h3>
              <SelectWrapper>
                <SelectElement
                  value={member.race}
                  onChange={(e) => updatePartyMember(index, 'race', e.target.value)}
                >
                  <option value="random">Select Race</option>
                  {RACES.map(race => (
                    <option key={race} value={race}>{race}</option>
                  ))}
                </SelectElement>
                <SquareRandomButton 
                  onClick={() => randomizePartyMember(index, 'race')}
                >
                  🎲
                </SquareRandomButton>
              </SelectWrapper>
              <SelectWrapper>
                <SelectElement
                  value={member.class}
                  onChange={(e) => updatePartyMember(index, 'class', e.target.value)}
                >
                  <option value="random">Select Class</option>
                  {CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </SelectElement>
                <SquareRandomButton 
                  onClick={() => randomizePartyMember(index, 'class')}
                >
                  🎲
                </SquareRandomButton>
              </SelectWrapper>
            </PartyMemberCard>
          ))}
        </PartyGrid>
      )}
    </Section>
  );

  // Update the settings selection render function
  const renderSettingSelection = () => (
    <Section>
      <SettingsGrid>
        <label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            Environment:
            <SelectWrapper>
              <SelectElement
                value={selectedSettings.environment}
                onChange={(e) => setSelectedSettings({
                  ...selectedSettings,
                  environment: e.target.value
                })}
              >
                <option value="">Select Environment</option>
                {ENVIRONMENTS.map(env => (
                  <option key={env} value={env}>{env}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeSingleSetting('environment', ENVIRONMENTS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </div>
        </label>

        <label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            Political System:
            <SelectWrapper>
              <SelectElement
                value={selectedSettings.politicalSystem}
                onChange={(e) => setSelectedSettings({
                  ...selectedSettings,
                  politicalSystem: e.target.value
                })}
              >
                <option value="">Select Political System</option>
                {POLITICAL_SYSTEMS.map(system => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeSingleSetting('politicalSystem', POLITICAL_SYSTEMS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </div>
        </label>

        <label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            Season:
            <SelectWrapper>
              <SelectElement
                value={selectedSettings.season}
                onChange={(e) => setSelectedSettings({
                  ...selectedSettings,
                  season: e.target.value
                })}
              >
                <option value="">Select Season</option>
                {SEASONS.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeSingleSetting('season', SEASONS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </div>
        </label>

        <label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            Weather:
            <SelectWrapper>
              <SelectElement
                value={selectedSettings.weather}
                onChange={(e) => setSelectedSettings({
                  ...selectedSettings,
                  weather: e.target.value
                })}
              >
                <option value="">Select Weather</option>
                {WEATHER_CONDITIONS.map(weather => (
                  <option key={weather} value={weather}>{weather}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeSingleSetting('weather', WEATHER_CONDITIONS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </div>
        </label>

        <label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            Technology Level:
            <SelectWrapper>
              <SelectElement
                value={selectedSettings.techLevel}
                onChange={(e) => setSelectedSettings({
                  ...selectedSettings,
                  techLevel: e.target.value
                })}
              >
                <option value="">Select Technology Level</option>
                {TECH_LEVELS.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeSingleSetting('techLevel', TECH_LEVELS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </div>
        </label>

        <label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            Magic Level:
            <SelectWrapper>
              <SelectElement
                value={selectedSettings.magicLevel}
                onChange={(e) => setSelectedSettings({
                  ...selectedSettings,
                  magicLevel: e.target.value
                })}
              >
                <option value="">Select Magic Level</option>
                {MAGIC_LEVELS.map(magic => (
                  <option key={magic} value={magic}>{magic}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeSingleSetting('magicLevel', MAGIC_LEVELS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </div>
        </label>
      </SettingsGrid>
    </Section>
  );

  const renderAdventureGenerator = () => (
    <Section>
      <AdventureGrid>
        <CategorySection>
          <h3>
            Core Conflict
            <SelectWrapper>
              <SelectElement
                value={adventureSettings.conflictType}
                onChange={(e) => setAdventureSettings(prev => ({
                  ...prev,
                  conflictType: e.target.value
                }))}
              >
                <option value="">Select Conflict Type</option>
                {CONFLICT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeCategory('conflictType', CONFLICT_TYPES)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </h3>
        </CategorySection>

        <CategorySection>
          <h3>
            Antagonist
            <SelectWrapper>
              <SelectElement
                value={adventureSettings.antagonistType}
                onChange={(e) => setAdventureSettings(prev => ({
                  ...prev,
                  antagonistType: e.target.value
                }))}
              >
                <option value="">Select Antagonist Type</option>
                {ANTAGONIST_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeCategory('antagonistType', ANTAGONIST_TYPES)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </h3>
        </CategorySection>

        <CategorySection>
          <h3>
            Stakes
            <SelectWrapper>
              <SelectElement
                value={adventureSettings.stakes}
                onChange={(e) => setAdventureSettings(prev => ({
                  ...prev,
                  stakes: e.target.value
                }))}
              >
                <option value="">Select Stakes</option>
                {STAKES.map(stake => (
                  <option key={stake} value={stake}>{stake}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeCategory('stakes', STAKES)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </h3>
        </CategorySection>

        <CategorySection>
          <h3>
            Complications
            <SelectWrapper>
              <SelectElement
                value={adventureSettings.complications}
                onChange={(e) => setAdventureSettings(prev => ({
                  ...prev,
                  complications: e.target.value
                }))}
              >
                <option value="">Select Complication</option>
                {COMPLICATIONS.map(complication => (
                  <option key={complication} value={complication}>{complication}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeCategory('complications', COMPLICATIONS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </h3>
        </CategorySection>

        <CategorySection>
          <h3>
            Plot Twist
            <SelectWrapper>
              <SelectElement
                value={adventureSettings.plotTwist}
                onChange={(e) => setAdventureSettings(prev => ({
                  ...prev,
                  plotTwist: e.target.value
                }))}
              >
                <option value="">Select Plot Twist</option>
                {PLOT_TWISTS.map(twist => (
                  <option key={twist} value={twist}>{twist}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeCategory('plotTwist', PLOT_TWISTS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </h3>
        </CategorySection>

        <CategorySection>
          <h3>
            MacGuffin
            <SelectWrapper>
              <SelectElement
                value={adventureSettings.macguffin}
                onChange={(e) => setAdventureSettings(prev => ({
                  ...prev,
                  macguffin: e.target.value
                }))}
              >
                <option value="">Select MacGuffin</option>
                {MACGUFFINS.map(macguffin => (
                  <option key={macguffin} value={macguffin}>{macguffin}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeCategory('macguffin', MACGUFFINS)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </h3>
        </CategorySection>

        <CategorySection>
          <h3>
            Location Significance
            <SelectWrapper>
              <SelectElement
                value={adventureSettings.locationSignificance}
                onChange={(e) => setAdventureSettings(prev => ({
                  ...prev,
                  locationSignificance: e.target.value
                }))}
              >
                <option value="">Select Location Significance</option>
                {LOCATION_SIGNIFICANCE.map(significance => (
                  <option key={significance} value={significance}>{significance}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeCategory('locationSignificance', LOCATION_SIGNIFICANCE)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </h3>
        </CategorySection>

        <CategorySection>
          <h3>
            Time Pressure
            <SelectWrapper>
              <SelectElement
                value={adventureSettings.timePressure}
                onChange={(e) => setAdventureSettings(prev => ({
                  ...prev,
                  timePressure: e.target.value
                }))}
              >
                <option value="">Select Time Pressure</option>
                {TIME_PRESSURE.map(pressure => (
                  <option key={pressure} value={pressure}>{pressure}</option>
                ))}
              </SelectElement>
              <SquareRandomButton 
                onClick={() => randomizeCategory('timePressure', TIME_PRESSURE)}
              >
                🎲
              </SquareRandomButton>
            </SelectWrapper>
          </h3>
        </CategorySection>

        <BottomButtonGroup>
          <RandomizeButton onClick={randomizeAllAdventure}>
            🎲 Randomize All Elements
          </RandomizeButton>
          <Button onClick={() => setAdventureSettings({
            conflictType: '',
            antagonistType: '',
            stakes: '',
            complications: '',
            plotTwist: '',
            macguffin: '',
            locationSignificance: '',
            timePressure: ''
          })}>
            Clear All
          </Button>
        </BottomButtonGroup>
      </AdventureGrid>
    </Section>
  );

  const renderSummary = () => (
    <SummarySection>
      <SummaryTitle>Adventure Summary</SummaryTitle>
      
      {/* Party Section */}
      <SummaryCategory>
        <CategoryTitle>🎭 Party Composition</CategoryTitle>
        <CategoryContent>
          {party.map((member, index) => (
            member.race && member.class && (
              <div key={index}>
                Character {index + 1}: {member.race} {member.class}
              </div>
            )
          ))}
        </CategoryContent>
      </SummaryCategory>

      {/* World Setting Section */}
      <SummaryCategory>
        <CategoryTitle>🌍 World Setting</CategoryTitle>
        <CategoryContent>
          {selectedSettings.environment && (
            <div>Environment: {selectedSettings.environment}</div>
          )}
          {selectedSettings.politicalSystem && (
            <div>Political System: {selectedSettings.politicalSystem}</div>
          )}
          {selectedSettings.season && (
            <div>Season: {selectedSettings.season}</div>
          )}
          {selectedSettings.weather && (
            <div>Weather: {selectedSettings.weather}</div>
          )}
          {selectedSettings.techLevel && (
            <div>Technology Level: {selectedSettings.techLevel}</div>
          )}
          {selectedSettings.magicLevel && (
            <div>Magic Level: {selectedSettings.magicLevel}</div>
          )}
        </CategoryContent>
      </SummaryCategory>

      {/* Adventure Elements Section */}
      <SummaryCategory>
        <CategoryTitle>⚔️ Adventure Elements</CategoryTitle>
        <CategoryContent>
          {adventureSettings.conflictType && (
            <div>Core Conflict: {adventureSettings.conflictType}</div>
          )}
          {adventureSettings.antagonistType && (
            <div>Antagonist: {adventureSettings.antagonistType}</div>
          )}
          {adventureSettings.stakes && (
            <div>Stakes: {adventureSettings.stakes}</div>
          )}
          {adventureSettings.complications && (
            <div>Complications: {adventureSettings.complications}</div>
          )}
          {adventureSettings.plotTwist && (
            <div>Plot Twist: {adventureSettings.plotTwist}</div>
          )}
          {adventureSettings.macguffin && (
            <div>MacGuffin: {adventureSettings.macguffin}</div>
          )}
          {adventureSettings.locationSignificance && (
            <div>Location Significance: {adventureSettings.locationSignificance}</div>
          )}
          {adventureSettings.timePressure && (
            <div>Time Pressure: {adventureSettings.timePressure}</div>
          )}
        </CategoryContent>
      </SummaryCategory>
    </SummarySection>
  );

  return (
    <Container>
      <ContentContainer>
        <Header>
          <TopBar>
            <BackButton onClick={() => window.location.href = '/devs-web-zone'}>
              ← Back to Home
            </BackButton>
          </TopBar>
          <TabContainer>
            <TabGroup>
              <Tab $isActive={activeTab === 'party'} onClick={() => setActiveTab('party')}>
                Party
              </Tab>
              <Tab $isActive={activeTab === 'setting'} onClick={() => setActiveTab('setting')}>
                World
              </Tab>
              <Tab $isActive={activeTab === 'adventure'} onClick={() => setActiveTab('adventure')}>
                Adventure
              </Tab>
            </TabGroup>
            <TopButtonGroup>
              <RandomizeAllButton onClick={randomizeAll}>
                🎲 Randomize Everything
              </RandomizeAllButton>
              <Button onClick={clearAll}>
                Clear Everything
              </Button>
            </TopButtonGroup>
          </TabContainer>
        </Header>

        <TabContent>
          {activeTab === 'party' && (
            <Section>
              <h2>Party Composition</h2>
              {renderPartyCreation()}
              <ButtonGroup>
                <RandomizeButton onClick={randomizeParty}>
                  🎲 Random Party
                </RandomizeButton>
                <Button onClick={clearParty}>
                  Clear All
                </Button>
                <Button onClick={() => setActiveTab('setting')}>
                  Continue to Setting
                </Button>
              </ButtonGroup>
            </Section>
          )}

          {activeTab === 'setting' && (
            <Section>
              <h2>World Setting</h2>
              {renderSettingSelection()}
              <ButtonGroup>
                <RandomizeButton onClick={randomizeSetting}>
                  🎲 Randomize Setting
                </RandomizeButton>
                <Button onClick={clearSettings}>
                  Clear All
                </Button>
                <Button onClick={() => setActiveTab('adventure')}>
                  Continue to Adventure
                </Button>
              </ButtonGroup>
            </Section>
          )}

          {activeTab === 'adventure' && (
            <Section>
              <h2>Adventure Generator</h2>
              {renderAdventureGenerator()}
            </Section>
          )}

          {renderSummary()}
        </TabContent>
      </ContentContainer>
    </Container>
  );
};

export default DndGenerator;