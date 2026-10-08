/* Which topic is open. Screens read it with getTopic() and redraw when a 'topicchange' event fires on document. */
import {TOPICS} from '../topics/topic-list.js';

let current=TOPICS[0];
export const getTopic=()=>current;
export function setTopic(id){if(current.id===id)return;current=TOPICS.find(t=>t.id===id);document.dispatchEvent(new CustomEvent('topicchange',{detail:{topic:current}}))}
