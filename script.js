// Rhyme or Reason - Game Logic

// Game state
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    targetScore: 10,
    currentPrompt: '',
    currentChoice: '',
    timerInterval: null,
    timeRemaining: 15,
    votes: [],
    votedPlayers: new Set(),
    gamePhase: 'setup' // setup, ready, choosing, thinking, voting, winner
};

// Diverse prompts across categories
const prompts = [
    // Simple words
    'cat', 'moon', 'dance', 'star', 'dream', 'fire', 'rain', 'snow', 'wind', 'light',
    'dark', 'phone', 'book', 'tree', 'door', 'car', 'sun', 'night', 'day', 'fly',
    'run', 'sing', 'play', 'work', 'smile', 'laugh', 'cry', 'sleep', 'wake', 'eat',
    
    // Abstract concepts
    'freedom', 'chaos', 'love', 'peace', 'anger', 'joy', 'fear', 'hope', 'truth', 'beauty',
    'justice', 'wisdom', 'courage', 'patience', 'silence', 'energy', 'power', 'trust', 'faith', 'pride',
    
    // Common phrases
    'break the ice', 'time flies', 'piece of cake', 'hit the road', 'spill the beans',
    'bite the bullet', 'under the weather', 'cost an arm and a leg', 'break a leg',
    'once in a blue moon', 'raining cats and dogs', 'let the cat out of the bag',
    
    // Objects
    'umbrella', 'microphone', 'guitar', 'camera', 'glasses', 'mirror', 'balloon', 'candle',
    'clock', 'pillow', 'bottle', 'wallet', 'keys', 'shoe', 'hat', 'jacket', 'bag',
    'lamp', 'chair', 'table', 'computer', 'television', 'speaker', 'headphone',
    
    // Actions
    'jumping', 'laughing', 'thinking', 'running', 'dancing', 'singing', 'writing', 'reading',
    'cooking', 'painting', 'swimming', 'flying', 'driving', 'walking', 'talking', 'listening',
    'watching', 'playing', 'working', 'studying', 'teaching', 'learning',
    
    // Bar-themed
    'cocktail', 'bartender', 'happy hour', 'last call', 'tab', 'toast', 'cheers', 'shots',
    'beer', 'wine', 'mixer', 'ice', 'lime', 'shaker', 'glass', 'bottle', 'draft',
    
    // Challenging prompts
    'philosophy', 'yesterday', 'tomorrow', 'memory', 'imagination', 'revolution', 'evolution',
    'technology', 'universe', 'infinity', 'mystery', 'adventure', 'destiny', 'legacy',
    'harmony', 'melody', 'rhythm', 'passion', 'ambition', 'determination',

    // Bar & Drinking Words
    'lager', 'stout', 'porter', 'ale', 'pint', 'keg', 'tap', 'cork', 'tipsy', 'buzzed',
    'wasted', 'sober', 'hangover', 'brewery', 'distillery', 'cellar', 'vintage', 'decant',
    'carafe', 'flute', 'snifter', 'growler', 'stein', 'tankard', 'goblet', 'tumbler',
    'highball', 'lowball', 'jigger', 'muddler', 'strainer', 'bitters', 'garnish', 'rim',
    'pour', 'sip', 'gulp', 'chug', 'swirl', 'sniff', 'taste', 'finish', 'nose', 'palate',
    'drunk', 'merry', 'toasted', 'sloshed', 'hammered', 'plastered', 'blitzed', 'soused',
    'pub', 'tavern', 'saloon', 'speakeasy', 'lounge', 'nightclub', 'bar stool', 'booth',
    'bouncer', 'barback', 'mixologist', 'sommelier', 'brewer', 'distiller', 'cicerone',
    'tab', 'round', 'tip', 'check', 'order', 'refill', 'last call', 'closing time',

    // Wine & Spirits
    'merlot', 'cabernet', 'chardonnay', 'pinot noir', 'sauvignon blanc', 'riesling',
    'prosecco', 'champagne', 'cava', 'moscato', 'malbec', 'shiraz', 'syrah', 'zinfandel',
    'pinot grigio', 'viognier', 'grenache', 'tempranillo', 'sangiovese', 'nebbiolo',
    'chianti', 'bordeaux', 'burgundy', 'barolo', 'rioja', 'chablis', 'sancerre',
    'whiskey', 'bourbon', 'scotch', 'rye', 'vodka', 'gin', 'rum', 'tequila', 'mezcal',
    'cognac', 'brandy', 'absinthe', 'amaretto', 'kahlua', 'baileys', 'campari',
    'aperol', 'vermouth', 'triple sec', 'cointreau', 'curacao', 'sambuca', 'grappa',
    'schnapps', 'ouzo', 'sake', 'soju', 'baijiu', 'pisco', 'calvados', 'armagnac',
    'single malt', 'blended', 'aged', 'oak barrel', 'cask', 'proof', 'distilled',
    'fermented', 'brewed', 'crafted', 'reserve', 'estate', 'vineyard', 'winery',

    // Cocktail Names
    'margarita', 'mojito', 'cosmopolitan', 'martini', 'manhattan', 'old fashioned',
    'negroni', 'boulevardier', 'sidecar', 'daiquiri', 'gimlet', 'sour', 'fizz',
    'collins', 'spritz', 'bellini', 'mimosa', 'sangria', 'mulled wine', 'hot toddy',
    'irish coffee', 'espresso martini', 'french 75', 'dark and stormy', 'moscow mule',
    'paloma', 'tequila sunrise', 'long island iced tea', 'sex on the beach', 'pina colada',
    'strawberry daiquiri', 'mai tai', 'hurricane', 'zombie', 'jungle juice',
    'white russian', 'black russian', 'harvey wallbanger', 'screwdriver', 'greyhound',
    'salty dog', 'sea breeze', 'bay breeze', 'madras', 'fuzzy navel', 'woo woo',
    'kamikaze', 'lemon drop', 'appletini', 'chocolate martini', 'pornstar martini',
    'aperol spritz', 'hugo spritz', 'gin and tonic', 'rum and coke', 'whiskey sour',
    'amaretto sour', 'pisco sour', 'new york sour', 'clover club', 'aviation',
    'bee knees', 'last word', 'paper plane', 'naked and famous', 'penicillin',
    'blood and sand', 'rob roy', 'rusty nail', 'godfather', 'godmother', 'stinger',
    'grasshopper', 'pink squirrel', 'brandy alexander', 'mudslide', 'toasted almond',
    'slippery nipple', 'blow job', 'buttery nipple', 'angel shot', 'prairie fire',
    'boilermaker', 'depth charge', 'car bomb', 'jagerbomb', 'three wise men',

    // Beer Types & Styles
    'pilsner', 'weizen', 'hefeweizen', 'dunkel', 'bock', 'doppelbock', 'maibock',
    'oktoberfest', 'marzen', 'rauchbier', 'kolsch', 'altbier', 'gose', 'berliner weisse',
    'saison', 'farmhouse ale', 'witbier', 'belgian tripel', 'belgian dubbel', 'quad',
    'lambic', 'gueuze', 'kriek', 'faro', 'flanders red', 'oud bruin', 'trappist',
    'abbey ale', 'cream ale', 'blonde ale', 'golden ale', 'pale ale', 'amber ale',
    'red ale', 'brown ale', 'milk stout', 'oatmeal stout', 'imperial stout', 'dry stout',
    'foreign extra stout', 'american ipa', 'english ipa', 'double ipa', 'triple ipa',
    'session ipa', 'hazy ipa', 'new england ipa', 'west coast ipa', 'black ipa',
    'red ipa', 'brut ipa', 'sour ipa', 'fruited sour', 'kettle sour', 'barrel aged',
    'nitro', 'cask conditioned', 'unfiltered', 'craft beer', 'macro brew', 'microbrewery',
    'nano brewery', 'taproom', 'brewpub', 'beer flight', 'beer garden', 'biergarten',

    // Bar Phrases & Slang
    'on the rocks', 'straight up', 'neat', 'with a twist', 'dirty', 'dry', 'wet',
    'double shot', 'open bar', 'cash bar', 'two for one', 'happy hour', 'last round',
    'round of drinks', 'liquid courage', 'bar crawl', 'pub crawl', 'wine flight',
    'beer tower', 'pitcher of beer', 'bucket of beers', 'bottle service', 'VIP table',
    'well drink', 'top shelf', 'call drink', 'premium pour', 'house special',
    'shot and a beer', 'beer back', 'chaser', 'palette cleanser', 'amuse bouche',
    'bar snacks', 'closing time', 'last orders', 'drink up', 'fill it up',
    'one more round', 'keep the change', 'run a tab', 'split the bill', 'dutch treat',
    'bar fight', 'bar trivia', 'bar games', 'pool table', 'dart board', 'jukebox',
    'karaoke night', 'open mic', 'live music', 'DJ set', 'dance floor',

    // Drinking Idioms & Expressions
    'three sheets to the wind', 'hit the bottle', 'drink like a fish', 'raise a glass',
    'toast the night', 'bottoms up', 'down the hatch', 'cheers to that', 'here here',
    'drink to your health', 'the bottom of the bottle', 'hair of the dog',
    'never drink alone', 'one for the road', 'a nightcap', 'dutch courage',
    'wine not', 'beer before liquor', 'liquor before beer', 'in vino veritas',
    'wine oclock', 'its five oclock somewhere', 'pour one out', 'drown your sorrows',
    'drink away the pain', 'liquid breakfast', 'brunch mimosa', 'sunday funday',
    'day drinking', 'afternoon delight', 'pre-game', 'after party', 'nightlife',
    'bar hopping', 'stumbling home', 'next day regret', 'the walk of shame',
    'what happens at the bar', 'drunk text', 'drunk dial', 'drunk decision',
    'sober up', 'sleep it off', 'water between drinks', 'drink responsibly',

    // Bar Culture & Atmosphere
    'karaoke', 'trivia night', 'game night', 'ladies night', 'guys night',
    'bachelorette', 'bachelor party', 'birthday shots', 'celebratory drink',
    'networking drinks', 'after work drinks', 'wind down', 'unwinding',
    'neon sign', 'dim lights', 'bar atmosphere', 'ambiance', 'vibe', 'chill spot',
    'watering hole', 'local bar', 'neighborhood pub', 'dive bar', 'sports bar',
    'cocktail bar', 'wine bar', 'rooftop bar', 'hotel bar', 'airport bar',
    'beach bar', 'pool bar', 'swim up bar', 'tiki bar', 'piano bar', 'jazz bar',
    'comedy club', 'strip club', 'gentlemens club', 'members only', 'private club',
    'regulars', 'locals', 'crowd', 'packed house', 'standing room', 'reservation',
    'waitlist', 'velvet rope', 'guest list', 'dress code', 'ID check', 'wristband',

    // Mixology & Bartending
    'muddle', 'shake', 'stir', 'strain', 'double strain', 'build', 'layer', 'float',
    'express', 'squeeze', 'zest', 'peel', 'wheel', 'wedge', 'flag', 'umbrella pick',
    'cocktail napkin', 'coaster', 'bar mat', 'speed rail', 'well', 'back bar',
    'liquor license', 'pour cost', 'comp drink', 'buyback', 'shift drink',
    'mise en place', 'prep work', 'batch cocktail', 'punch bowl', 'large format',
    'infusion', 'house made', 'fresh squeezed', 'hand crafted', 'artisanal',
    'smoked', 'flamed', 'dry ice', 'liquid nitrogen', 'clarified', 'fat washed',
    'acid adjusted', 'oleo saccharum', 'orgeat', 'falernum', 'grenadine', 'simple syrup',
    'honey syrup', 'demerara', 'agave nectar', 'shrub', 'tincture', 'bitters dash',
    'soda water', 'tonic water', 'ginger beer', 'ginger ale', 'cola', 'lemon juice',
    'lime juice', 'orange juice', 'grapefruit juice', 'cranberry juice', 'pineapple juice',
    'coconut cream', 'heavy cream', 'egg white', 'aquafaba', 'ice cube', 'crushed ice',
    'pebble ice', 'clear ice', 'ice ball', 'ice spear', 'ice mold', 'ice chipper',

    // Food & Bar Snacks
    'nachos', 'wings', 'sliders', 'pretzel', 'peanuts', 'popcorn', 'chips and dip',
    'cheese board', 'charcuterie', 'oysters', 'deviled eggs', 'mozzarella sticks',
    'loaded fries', 'onion rings', 'jalapeno poppers', 'spinach dip', 'guacamole',
    'bruschetta', 'calamari', 'shrimp cocktail', 'crab cakes', 'pot stickers',
    'spring rolls', 'flatbread', 'pizza', 'burger', 'hot dog', 'brat',

    // Beer & Brewing Terms
    'hops', 'malt', 'barley', 'yeast', 'wort', 'mash', 'lauter', 'sparge', 'ferment',
    'condition', 'carbonate', 'pitch', 'krausen', 'gravity', 'ABV', 'IBU', 'SRM',
    'head', 'lacing', 'clarity', 'cloudiness', 'haze', 'aroma', 'hop forward',
    'malty', 'bitter', 'sweet', 'dry', 'crisp', 'smooth', 'full bodied', 'light bodied',
    'sessionable', 'crushable', 'drinkable', 'refreshing', 'complex', 'balanced',
    'hoppy', 'roasty', 'toasty', 'caramel notes', 'chocolate notes', 'coffee notes',
    'fruity', 'citrusy', 'tropical', 'floral', 'earthy', 'piney', 'grassy', 'spicy',
    'peppery', 'funky', 'sour', 'tart', 'acidic', 'effervescent', 'flat', 'stale',
    'skunky', 'oxidized', 'infected', 'off flavor', 'diacetyl', 'acetaldehyde',

    // Wine Terms & Culture
    'tannins', 'acidity', 'bouquet', 'terroir', 'appellation', 'varietal', 'blend',
    'vintage year', 'old vine', 'reserve wine', 'grand cru', 'premier cru', 'cru bourgeois',
    'chateau', 'domaine', 'estate bottled', 'negociant', 'cave', 'harvest', 'crush',
    'maceration', 'barrel aging', 'oak influence', 'malolactic', 'lees aging', 'riddling',
    'dosage', 'disgorgement', 'methode champenoise', 'traditional method', 'natural wine',
    'biodynamic', 'organic wine', 'low intervention', 'skin contact', 'orange wine',
    'rose wine', 'blanc de blancs', 'blanc de noirs', 'brut nature', 'extra brut',
    'brut', 'extra dry', 'sec', 'demi-sec', 'doux', 'late harvest', 'ice wine',
    'noble rot', 'botrytis', 'dessert wine', 'port wine', 'sherry', 'madeira',
    'marsala', 'vermouth', 'vin santo', 'ice wine', 'eiswein', 'trockenbeerenauslese',

    // Whiskey & Spirits Culture
    'single barrel', 'small batch', 'straight bourbon', 'bonded', 'bottled in bond',
    'high rye', 'wheated', 'corn mash', 'grain bill', 'mashbill', 'sour mash',
    'sweet mash', 'charred oak', 'new oak', 'used barrel', 'finish', 'double barrel',
    'cask strength', 'barrel proof', 'navy strength', 'overproof', 'standard proof',
    'lowland scotch', 'highland scotch', 'speyside scotch', 'islay scotch', 'island scotch',
    'campbeltown scotch', 'peated', 'unpeated', 'heavily peated', 'peat reek',
    'smoke finish', 'medicinal', 'briny', 'maritime', 'seaweed', 'iodine',
    'japanese whisky', 'irish whiskey', 'american rye', 'canadian whisky',
    'blended malt', 'blended grain', 'blended scotch', 'vatted malt', 'pure pot still',
    'column still', 'pot still', 'continuous still', 'coffey still', 'copper pot',

    // Cocktail Culture & History
    'prohibition era', 'speakeasy culture', 'bootleg liquor', 'bathtub gin', 'moonshine',
    'home brew', 'home distill', 'craft cocktail', 'cocktail renaissance', 'golden age',
    'classic cocktail', 'modern classic', 'signature drink', 'house cocktail',
    'seasonal menu', 'rotating menu', 'prix fixe', 'tasting menu', 'cocktail pairing',
    'food pairing', 'cheese pairing', 'chocolate pairing', 'dessert pairing',
    'whiskey tasting', 'wine tasting', 'beer tasting', 'spirit tasting', 'blind tasting',
    'vertical tasting', 'horizontal tasting', 'flight tasting', 'guided tasting',

    // Drinking Games & Bar Activities
    'beer pong', 'flip cup', 'kings cup', 'quarters', 'never have I ever', 'truth or dare',
    'spin the bottle', 'drunk jenga', 'shot roulette', 'card games', 'poker night',
    'pool shark', 'darts league', 'bar olympics', 'drinking contest', 'chug race',
    'shotski', 'power hour', 'century club', 'Edward Fortyhands', 'wizard staff',
    'scavenger hunt', 'pub quiz', 'bar bingo', 'bar trivia', 'name that tune',

    // Party & Celebration
    'cheers', 'salud', 'prost', 'slainte', 'skol', 'cin cin', 'kampai', 'nazdrave',
    'lchaim', 'gesundheit', 'toast', 'speech', 'roast', 'tribute', 'dedication',
    'anniversary', 'promotion', 'graduation', 'retirement', 'first drink', 'legal age',
    'birthday party', 'new years eve', 'st patricks day', 'mardi gras', 'cinco de mayo',
    'oktoberfest party', 'holiday party', 'office party', 'house party', 'block party',
    'tailgate', 'pregame', 'after game', 'victory drink', 'consolation drink',

    // General Fun Words (Bar Context)
    'weekend', 'friday night', 'saturday night', 'sunday brunch', 'late night',
    'midnight', 'last dance', 'encore', 'one last song', 'closing song',
    'taxi', 'uber', 'designated driver', 'safe ride home', 'stumble home',
    'morning after', 'greasy breakfast', 'hangover cure', 'bloody mary', 'mimosa cure',
    'hair of the dog', 'pickle juice', 'coconut water', 'sports drink', 'water bottle',
    'aspirin', 'ibuprofen', 'antacid', 'sleep in', 'lazy day', 'couch day',
    'regret nothing', 'no ragrets', 'YOLO', 'live your best life', 'treat yourself',
    'you only live once', 'seize the day', 'eat drink be merry', 'wine dine',
    'feast', 'banquet', 'gala', 'soiree', 'shindig', 'rager', 'kickback', 'hangout',

    // Additional Single Words
    'swig', 'nip', 'dram', 'tot', 'slug', 'snort', 'belt', 'pull', 'quaff', 'imbibe',
    'tipple', 'libation', 'nightcap', 'digestif', 'aperitif', 'cordial', 'liqueur',
    'spirit', 'hooch', 'booze', 'sauce', 'grog', 'brew', 'suds', 'bubbly', 'vino',
    'plonk', 'swill', 'rotgut', 'firewater', 'jungle juice', 'nectar', 'elixir', 'potion',
    'draught', 'cask', 'barrel', 'vat', 'hogshead', 'puncheon', 'tierce', 'pipe',
    'butt', 'tun', 'firkin', 'kilderkin', 'pin', 'rundlet', 'quarter cask',
    'magnum', 'jeroboam', 'rehoboam', 'methuselah', 'salmanazar', 'balthazar', 'nebuchadnezzar',
    'demi', 'half bottle', 'standard bottle', 'liter bottle', 'handle', 'jug',
    'box wine', 'bag in box', 'canned wine', 'canned cocktail', 'hard seltzer',
    'hard cider', 'hard kombucha', 'hard lemonade', 'malt beverage', 'flavored malt',
    'radler', 'shandy', 'michelada', 'chelada', 'beer cocktail', 'boilermaker',
    'black and tan', 'half and half', 'snakebite', 'diesel', 'dirty bastard'
];

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('new-round-btn').addEventListener('click', startNewRound);
    document.getElementById('rhyme-btn').addEventListener('click', () => selectChoice('RHYME'));
    document.getElementById('reason-btn').addEventListener('click', () => selectChoice('REASON'));
    document.getElementById('skip-btn').addEventListener('click', skipTurn);
    document.getElementById('approve-btn').addEventListener('click', () => castVote(true));
    document.getElementById('reject-btn').addEventListener('click', () => castVote(false));
    
    // Player count change handler
    document.getElementById('player-count').addEventListener('change', updatePlayerInputs);
    
    // Initialize player inputs
    updatePlayerInputs();
});

function updatePlayerInputs() {
    const playerCount = parseInt(document.getElementById('player-count').value);
    const container = document.getElementById('player-names-container');
    container.innerHTML = '';
    
    for (let i = 1; i <= playerCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player-${i}`;
        input.placeholder = `Player ${i} Name`;
        input.required = true;
        input.className = 'w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 border-gray-700 focus:border-pink-500 focus:outline-none text-lg';
        container.appendChild(input);
    }
}

function startGame() {
    const playerCount = parseInt(document.getElementById('player-count').value);
    const targetScore = parseInt(document.getElementById('target-score').value);
    
    // Collect player names
    gameState.players = [];
    for (let i = 1; i <= playerCount; i++) {
        const name = document.getElementById(`player-${i}`).value.trim();
        if (!name) {
            alert(`Please enter a name for Player ${i}`);
            return;
        }
        gameState.players.push({ name, score: 0 });
    }
    
    gameState.targetScore = targetScore;
    gameState.currentPlayerIndex = 0;
    gameState.gamePhase = 'ready';
    
    // Hide setup screen, show game screen
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Render scoreboard
    renderScoreboard();
    updateCurrentPlayer();
    
    // Set initial prompt message
    document.getElementById('prompt-display').textContent = 'Click "Start Round" to begin!';
}

function renderScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card' + (index === gameState.currentPlayerIndex ? ' player-active' : '');
        playerCard.innerHTML = `
            <p class="font-semibold text-white">${player.name}</p>
            <p class="text-2xl font-bold ${index === gameState.currentPlayerIndex ? 'neon-glow-cyan' : 'text-gray-300'}">${player.score} pts</p>
        `;
        scoreboard.appendChild(playerCard);
    });
}

function updateCurrentPlayer() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('current-player-name').textContent = currentPlayer.name;
}

function startNewRound() {
    gameState.gamePhase = 'choosing';
    
    // Get random prompt
    gameState.currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // Display prompt
    document.getElementById('prompt-display').textContent = gameState.currentPrompt;
    document.getElementById('choice-display').classList.add('hidden');
    
    // Show choice buttons, hide action buttons
    document.getElementById('choice-buttons').classList.remove('hidden');
    document.getElementById('new-round-btn').classList.add('hidden');
    document.getElementById('skip-btn').classList.remove('hidden');
    
    // Hide voting section and timer
    document.getElementById('voting-section').classList.add('hidden');
    document.getElementById('timer-container').classList.add('hidden');
}

function selectChoice(choice) {
    gameState.currentChoice = choice;
    gameState.gamePhase = 'thinking';
    
    // Hide choice buttons
    document.getElementById('choice-buttons').classList.add('hidden');
    
    // Show choice and start timer
    const choiceDisplay = document.getElementById('choice-display');
    choiceDisplay.textContent = `You chose: ${choice === 'RHYME' ? '🎵 RHYME' : '💡 REASON'}`;
    choiceDisplay.className = `text-xl font-semibold mb-2 ${choice === 'RHYME' ? 'neon-glow-pink' : 'neon-glow-cyan'}`;
    choiceDisplay.classList.remove('hidden');
    
    // Start timer
    startTimer();
}

function startTimer() {
    gameState.timeRemaining = 15;
    const timerDisplay = document.getElementById('timer-display');
    const timerProgress = document.getElementById('timer-progress');
    const timerContainer = document.getElementById('timer-container');
    
    timerContainer.classList.remove('hidden');
    timerDisplay.textContent = gameState.timeRemaining;
    timerProgress.style.width = '100%';
    timerProgress.classList.remove('warning');
    
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        timerDisplay.textContent = gameState.timeRemaining;
        timerProgress.style.width = `${(gameState.timeRemaining / 15) * 100}%`;
        
        if (gameState.timeRemaining <= 5) {
            timerProgress.classList.add('warning');
        }
        
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            timerComplete();
        }
    }, 1000);
}

function timerComplete() {
    gameState.gamePhase = 'voting';
    
    // Hide skip button
    document.getElementById('skip-btn').classList.add('hidden');
    
    // Show voting section
    showVotingSection();
}

function showVotingSection() {
    const votingSection = document.getElementById('voting-section');
    const votingPlayerName = document.getElementById('voting-player-name');
    const votingChoice = document.getElementById('voting-choice');
    
    votingPlayerName.textContent = gameState.players[gameState.currentPlayerIndex].name;
    votingChoice.textContent = gameState.currentChoice;
    
    votingSection.classList.remove('hidden');
    
    // Reset votes and voted players
    gameState.votes = [];
    gameState.votedPlayers.clear();
    updateVoteTally();
}

function castVote(approved) {
    // Prevent multiple votes from being cast too quickly
    if (gameState.votedPlayers.size >= gameState.players.length - 1) {
        return;
    }
    
    gameState.votes.push(approved);
    gameState.votedPlayers.add(gameState.votedPlayers.size);
    updateVoteTally();
    
    // Check if all other players have voted
    const totalVoters = gameState.players.length - 1; // All except current player
    if (gameState.votes.length >= totalVoters) {
        processVotes();
    }
}

function updateVoteTally() {
    const totalVoters = gameState.players.length - 1;
    document.getElementById('vote-count').textContent = gameState.votes.length;
    document.getElementById('vote-total').textContent = totalVoters;
}

function processVotes() {
    // Clear any running timers
    clearInterval(gameState.timerInterval);
    
    const approvedVotes = gameState.votes.filter(v => v).length;
    const totalVotes = gameState.votes.length;
    const approved = approvedVotes > totalVotes / 2;
    
    if (approved) {
        // Award point
        gameState.players[gameState.currentPlayerIndex].score++;
        
        // Check for winner
        if (gameState.players[gameState.currentPlayerIndex].score >= gameState.targetScore) {
            showWinner();
            return;
        }
    }
    
    // Hide voting section
    document.getElementById('voting-section').classList.add('hidden');
    
    // Move to next player
    nextPlayer();
}

function skipTurn() {
    clearInterval(gameState.timerInterval);
    
    // Hide skip button
    document.getElementById('skip-btn').classList.add('hidden');
    
    // Hide choice buttons and timer
    document.getElementById('choice-buttons').classList.add('hidden');
    document.getElementById('timer-container').classList.add('hidden');
    
    // Move to next player
    nextPlayer();
}

function nextPlayer() {
    // Move to next player
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // Update UI
    renderScoreboard();
    updateCurrentPlayer();
    
    // Show new round button
    document.getElementById('new-round-btn').classList.remove('hidden');
    
    // Reset prompt
    document.getElementById('prompt-display').textContent = 'Click "Start Round" to continue!';
    document.getElementById('choice-display').classList.add('hidden');
    document.getElementById('timer-container').classList.add('hidden');
}

function showWinner() {
    // Clear any running timers
    clearInterval(gameState.timerInterval);
    
    const winner = gameState.players[gameState.currentPlayerIndex];
    
    // Hide game screen
    document.getElementById('game-screen').classList.add('hidden');
    
    // Show win screen
    const winScreen = document.getElementById('win-screen');
    winScreen.classList.remove('hidden');
    
    document.getElementById('winner-name').textContent = winner.name;
    document.getElementById('winner-score').textContent = winner.score;
}
