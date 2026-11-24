import test from 'node:test';
import assert from 'node:assert/strict';
import {matches,distance,validateFind} from '../lib/search.ts';
test('bilingual search resolves ingredient aliases and empty queries',()=>{assert.ok(matches('Dried porcini','牛肝菌'));assert.ok(matches('牛肝菌','porcini'));assert.ok(matches('Pandan leaves','斑斓'));assert.ok(matches('Anything',''));assert.ok(!matches('Yuzu','porcini'));});
test('distance orders Seattle neighborhoods and handles identical locations',()=>{assert.equal(distance(47.6,-122.3,47.6,-122.3),0);assert.ok(distance(47.6,-122.3,47.61,-122.3)<distance(47.6,-122.3,47.67,-122.38));});
const valid={item:'牛肝菌',form:'Dried',store:'A shop',address:'Seattle',lat:47.6,lng:-122.3,seen:'2026-01-01'};
test('rejects malformed reports, out-of-area coordinates and future dates',()=>{assert.equal(validateFind(valid),null);for(const changes of [{item:''},{lat:0},{lng:0},{form:'Invalid'},{seen:'2099-01-01'},{seen:'2026-02-30'},{note:'x'.repeat(601)}])assert.ok(validateFind({...valid,...changes}));});
