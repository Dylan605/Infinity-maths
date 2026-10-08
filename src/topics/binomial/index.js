/* The binomial topic. Importing each group of question types registers it in TYPES. */
import './types/expand.js';
import './types/find.js';
import './types/unknown.js';
import './types/other.js';

export {TYPES,genQ} from './registry.js';
export {GAMES} from './games.js';
