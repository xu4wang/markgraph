'use strict';

var jsyaml     = require('js-yaml');
var base64     = require('./base64');
var store      = require('./state');
var storage     = require('./storage');

const default_name = 'default_notes';
const frontpage = 'index';

var notes_name = default_name;

let config_file = 'diagram.system.configuration';

//eslint-disable-next-line
const default_b64 = 'eyJpbmRleCI6Ii0tLVxuc3R5bGU6IHt9XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuZm9sbG93OlxuICAtIG5vdGVcbm91dGxpbmU6XG4gIGluZGV4OiAxLiBJbnRyb2R1Y3Rpb25cbiAgdWk6IDIuIFVJIG92ZXJ2aWV3XG4gIG1hcmtkb3duOiAzLiBXcml0aW5nIGluIE1hcmtkb3duXG4gIHJlbWFya2FibGU6IDMuMSBNYXJrZG93biBzeW50ZXggcmVmZXJlbmNlXG4gIG1lcm1haWQ6IDMuMiBNZXJtYWlkIGRpYWdyYW0gcmVmZXJlbmNlXG4gIGJhY2t1cCBhbmQgY29sbGFib3JhdGlvbjogNC4gQmFja3VwIGFuZCBDb2xsYWJvcmF0aW9uXG4gIGFyY2hpdGVjdHVyZTogNS4xIERpYWdyYW0gRGVtbzEgTWFya2dyYXBoIEFyY2hpdGVjdHVyZVxuICBzdGlja3kgbm90ZXM6IDUuMiBEaWFncmFtIERlbW8yIFRhc2sgQm9hcmRcbiAgZGV2ZWxvcGVyOiA2LiBEZXZlbG9wZXJcbi0tLVxuXG5cbiMgV2VsY29tZSB0byB1c2UgbWFya2dyYXBoXG5cbj09Tm90ZTo9PSBcbi0gWW91IGNhbiBjbGljayBvbiB0aGUgcmlnaHQgc2lkZSB0aGUgb3V0bGluZSBidXR0b25zIHRvIG5hdmlnYXRlIHRoaXMgbWFudWFsLlxuLSBDbGljayB0aGUgKipFeHBsb3JlcioqIGFuZCAqKkVkaXRvcioqIGJ1dHRvbnMgdG8gbWFrZSB0aGVtIGdyYXkgZm9yIGxhcmdlciB2aWV3IGFyZWEuLlxuXG5NYXJrZ3JhcGggc3RhbmRzIGZvciBNYXJrZG93biBHcmFwaCBOb3Rlcy5cblxuUGxlYXNlIGZpbmQgYSBudW1iZXIgb2Yga2V5IGZlYXR1cmVzIGJlbG93OlxuXG4tIE1hcmtkb3duXG5cdC0gTWFya2Rvd24gZm9yIHdyaXRpbmcgZG9jdW1lbnQuXG4tIEdyYXBoXG5cdC0gTWVybWFpZCB0byBkcmF3IGRpYWdyYW1zXG5cdC0gQ29ubmVjdCBub2RlcyB0byBkcmF3IGNvbXBsZXggZGlhZ3JhbXMuXG4gICAgXG4gICAgRWFjaCBkb2N1bWVudCBpcyBhIG5vZGUsIG9uZSBub2RlIGNhbiBoYXZlIGEgbnVtYmVyIG9mIHN1YiBub2Rlcy4gVGhlIHN1Ym5vZGVzIGNhbiBiZSBjb25uZWN0ZWQgdmlhIGFycm93cyBpbiBkaWZmZXJlbnQgY29sb3IsIHN0eWxlIGV0Yy5cbi0gTm90ZXNcblx0LSBUaGVyZSBpcyBubyBzZXJ2ZXIgbmVlZGVkLiBUaGUgYXBwIGlzIGEgc2luZ2xlIHBhZ2UgYXBwIHJ1bm5pbmcgaW4geW91ciBicm93c2VyLlxuICAgIC0gRXZlcnkga2V5c3Ryb2tlIHdpbGwgYmUgc2F2ZWQgd2l0aGluIG9uZSBzZWNvbmQuXG4gICAgLSBHaXQgbGlrZSB0aW1lIG1hY2hpbmUgdG8ga2VlcCBjaGFuZ2VzIHNhdmVkIGFzIHNuYXBzaG90cywgeW91IGNhbiBhbHdheXMgZ28gYmFjayB0byBhIHByZXZpb3VzIHNuYXBzaG90LlxuXHQtIEVhc3kgdG8gaW1wb3J0IGFuZCBleHBvcnQgdmlhIGEgc2luZ2xlIHRleHQgZmlsZS5cblx0LSBFYXN5IHRvIHNoYXJlIHRoZSBkb2N1bWVudCB2aWEgYW4gVVJMLlxuICAgIFxuIyMgVGVybXMgdXNlZCBpbiBtYXJrZ3JhcGhcblxuV29ya3NwYWNlXG46ICBBbGwgdGhlIGRvY3VtZW50IHlvdSBjYW4gYWNjZXNzIGluIG1hcmtncmFwaCBVSS4gSW4gdGhlIHdvcmtzcGFjZSwgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIE5vdGVzLlxuXG5Ob3Rlc1xuOiAgQSBjb2xsZWN0aW9uIG9mIGRvY3VtZW50LiBUaGVyZSBtYXliZSBzZXZlcmFsIG5vdGVzIGluIHRoZSB3b3Jrc3BhY2UuIFlvdSBjYW4gc3dpdGNoIGJ5IHNlbGVjdGluZyBpbiB0aGUgZXhwbG9yZXIuIFxuXG5Ob2RlXG46ICBBIG5vZGUgaXMgYSBkb2N1bWVudC4gSXQgY2FuIGhhdmUgc3ViIG5vZGVzICggc3ViIGRvY3VtZW50cykgdG9vLlxuXG5TbmFwc2hvdFxuOiAgQSBjb3B5IG9mIHRoZSB3b3Jrc3BhY2UuXG5cbkV4cGxvcmVyXG46ICBBIGxpc3QgdmlldyB0byBzaG93IG5vdGVzIGluIGN1cnJlbnQgd29ya3NwYWNlLCBvciBub2RlcyB1bmRlciBjdXJyZW50IG5vdGVzLlxuXG5FZGl0b3JcbjogIEFuIGFyZWEgZm9yIGVkaXRpbmcgbm9kZS4gXG5cbkNhbnZhc1xuOiAgVGhlIGFyZWEgdG8gc2hvdyB0aGUgcHJldmlldyB2ZXJzaW9uIG9mIHRoZSBub2RlLlxuXG5PdXRsaW5lXG46ICBTaG93aW5nIGEgbGlzdCBvZiBub2RlcywgY2xpY2sgb24gb25lIGl0ZW0gd2lsbCBqdW1wIHRvIHRoYXQgbm9kZS5cblxuIyMgQWJvdXQgdGhpcyBtYW51YWxcblxuVGhpcyBtYW51YWwgaXRzZWxmIGlzIGJlaW5nIHdyaXRlbiBpbiBtYXJrZ3JwYWguIFlvdSBjYW4gY2hlY2sgdGhlIHNvdXJjZSBvZiBlYWNoIG5vZGUgaW4gdGhlIGVkaXRvciwgY2hlY2sgdGhlIHN0cnVjdHVyZSBvZiB0aGUgbm90ZXMgaW4gdGhlIGV4cGxvcmVyLlxuXG5cblxuIiwiZGlhZ3JhbS5zeXN0ZW0uY29uZmlndXJhdGlvbiI6Ii0tLVxuc3R5bGU6IHt9XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuYnV0dG9uczogW11cbmtlZXA6XG4gIC0gZGlhZ3JhbS5zeXN0ZW0uY29uZmlndXJhdGlvblxuLS0tXG5cbkNvbmZpZ3VyYXRpb24gRGF0YVxuIiwibWVybWFpZCI6Ii0tLVxuc3R5bGU6IHt9XG5mb2xsb3c6XG4gIC0gbm90ZVxubm9kZXM6IFtdXG5lZGdlczogW11cbi0tLVxuXG4jIE1lcm1haWQgZGlhZ3JhbXMgc2FtcGxlICYgcmVmZXJlbmNlXG5cbk1lcm1haWQgaXMgYW4gZW5naW5lIHRvIHRyYW5zbGF0ZSB0ZXh0IGludG8gZGlhZ3JhbS4gSXQgaXMgc3VwcG9ydGVkIGluIG1hcmtncmFwaC5cblxuXG5BbGwgdGhlIGJlbG93IGV4YW1wbGVzIGFyZSBib3Jyb3dlZCBmcm9tIFttZXJtYWlkIG9mZmljaWFsIHdlYnNpdGVdKGh0dHBzOi8vbWVybWFpZC1qcy5naXRodWIuaW8vbWVybWFpZC8pIC4gIEJhc2ljYWxseSwgeW91IHB1dCBtZXJtYWlkIGRpYWdyYW0gaW5zaWRlIGEgbWVybWFpZCBibG9jayBvZiB0aGUgbWFya2Rvd24gYm9keSwgYW5kIGl0IHdpbGwgYmUgcmVuZGVyZWQgYnkgbWVybWFpZCBlbmdpbmUuXG5cblxuIyMgYmFzaWMgZGlhZ3JhbVxuXG5gYGBtZXJtYWlkXG5ncmFwaCBURDtcbiAgICBBLS0+QjtcbiAgICBBLS0+QztcbiAgICBCLS0+RDtcbiAgICBDLS0+RDsgXG5gYGBcblxuIyMgc2VxdWVuY2UgZGlhZ3JhbS5cblxuYGBgbWVybWFpZFxuXG5zZXF1ZW5jZURpYWdyYW1cbiAgICBhdXRvbnVtYmVyXG4gICAgcGFydGljaXBhbnQgQWxpY2VcbiAgICBwYXJ0aWNpcGFudCBCb2JcbiAgICBBbGljZS0+PkpvaG46IEhlbGxvIEpvaG4sIGhvdyBhcmUgeW91P1xuICAgIGxvb3AgSGVhbHRoY2hlY2tcbiAgICAgICAgSm9obi0+PkpvaG46IEZpZ2h0IGFnYWluc3QgaHlwb2Nob25kcmlhXG4gICAgZW5kXG4gICAgTm90ZSByaWdodCBvZiBKb2huOiBSYXRpb25hbCB0aG91Z2h0cyA8YnIvPnByZXZhaWwhXG4gICAgSm9obi0tPj5BbGljZTogR3JlYXQhXG4gICAgSm9obi0+PkJvYjogSG93IGFib3V0IHlvdT9cbiAgICBCb2ItLT4+Sm9objogSm9sbHkgZ29vZCFcblxuYGBgXG5cbiMjIGNsYXNzIGRpYWdyYW1cblxuYGBgbWVybWFpZFxuY2xhc3NEaWFncmFtXG5DbGFzczAxIDx8LS0gQXZlcnlMb25nQ2xhc3MgOiBDb29sXG5DbGFzczAzICotLSBDbGFzczA0XG5DbGFzczA1IG8tLSBDbGFzczA2XG5DbGFzczA3IC4uIENsYXNzMDhcbkNsYXNzMDkgLS0+IEMyIDogV2hlcmUgYW0gaT9cbkNsYXNzMDkgLS0qIEMzXG5DbGFzczA5IC0tfD4gQ2xhc3MwN1xuQ2xhc3MwNyA6IGVxdWFscygpXG5DbGFzczA3IDogZXF1YWxzKClcbkNsYXNzMDcgOiBlcXVhbHNcbkNsYXNzMDcgOiBlcXVhbHNcbkNsYXNzMDcgOiBPYmplY3RbXSBlbGVtZW50RGF0YVxuQ2xhc3MwMSA6IHNpemUoKVxuQ2xhc3MwMSA6IGludCBjaGltcFxuQ2xhc3MwMSA6IGludCBnb3JpbGxhXG5DbGFzczA4IDwtLT4gQzI6IENvb2wgbGFiZWxcbmBgYFxuXG4jIyBnYW5udCBkaWFncmFtXG5cbmBgYG1lcm1haWRcbmdhbnR0XG5kYXRlRm9ybWF0ICBZWVlZLU1NLUREXG50aXRsZSBBZGRpbmcgR0FOVFQgZGlhZ3JhbSB0byBtZXJtYWlkXG5leGNsdWRlcyB3ZWVrZGF5cyAyMDE0LTAxLTEwXG5cbnNlY3Rpb24gQSBzZWN0aW9uXG5Db21wbGV0ZWQgdGFzayAgICAgICAgICAgIDpkb25lLCAgICBkZXMxLCAyMDE0LTAxLTA2LDIwMTQtMDEtMDhcbkFjdGl2ZSB0YXNrICAgICAgICAgICAgICAgOmFjdGl2ZSwgIGRlczIsIDIwMTQtMDEtMDksIDNkXG5GdXR1cmUgdGFzayAgICAgICAgICAgICAgIDogICAgICAgICBkZXMzLCBhZnRlciBkZXMyLCA1ZFxuRnV0dXJlIHRhc2syICAgICAgICAgICAgICAgOiAgICAgICAgIGRlczQsIGFmdGVyIGRlczMsIDVkXG5gYGBcblxuIyMgRVIgZGlhZ3JhbVxuYGBgbWVybWFpZFxuZXJEaWFncmFtXG4gICAgQ1VTVE9NRVIgfHwtLW97IE9SREVSIDogcGxhY2VzXG4gICAgT1JERVIgfHwtLXx7IExJTkUtSVRFTSA6IGNvbnRhaW5zXG4gICAgQ1VTVE9NRVIgfXwuLnx7IERFTElWRVJZLUFERFJFU1MgOiB1c2VzXG5gYGBcblxuIyMgZ2l0IGRpYWdyYW1cblxuYGBgbWVybWFpZFxuZ2l0R3JhcGhcbiAgICAgICBjb21taXRcbiAgICAgICBjb21taXRcbiAgICAgICBicmFuY2ggZGV2ZWxvcFxuICAgICAgIGNvbW1pdFxuICAgICAgIGNvbW1pdFxuICAgICAgIGNvbW1pdFxuICAgICAgIGNoZWNrb3V0IG1haW5cbiAgICAgICBjb21taXRcbiAgICAgICBjb21taXRcbmBgYFxuIyMgdXNlciBqb3VybmV5IGRpYWdyYW1cblxuYGBgbWVybWFpZFxuam91cm5leVxuICAgIHRpdGxlIE15IHdvcmtpbmcgZGF5XG4gICAgc2VjdGlvbiBHbyB0byB3b3JrXG4gICAgICAwOC8wMCBNYWtlIHRlYTogNTogTWVcbiAgICAgIEdvIHVwc3RhaXJzOiAzOiBNZVxuICAgICAgRG8gd29yazogMTogTWUsIENhdFxuICAgIHNlY3Rpb24gR28gaG9tZVxuICAgICAgR28gZG93bnN0YWlyczogNDogTWUsIEhpbVxuICAgICAgU2l0IGRvd246IDU6IE1lXG5gYGAiLCJub3RlIjoiLS0tXG5zdHlsZTpcbiAgd2lkdGg6IDkwMFxuICBoZWlnaHQ6IDUwMDBcbiAgdGV4dC1hbGlnbjogbGVmdFxuICBwYWRkaW5nLXRvcDogNTBweFxuICBwYWRkaW5nLWxlZnQ6IDUwcHhcbiAgcGFkZGluZy1yaWdodDogNTBweFxuICBsZWZ0OiAycHhcbiAgdG9wOiAycHhcbiAgbGluZS1oZWlnaHQ6IDEuNFxubm9kZXM6IFtdXG5lZGdlczogW11cbi0tLVxuXG4jIEhlYWRsaW5lIDFcblxuVGhpcyBpcyBhIHBhcmFncmFwaC5cblxuIyMgSGVhZGxpbmUgMlxuXG4jIyMgSGVhZGxpbmUzXG5cblRoaXMgaXMgdGhlIHRlbXBsYXRlIGZvciBub3RlIHRha2luZyBub2RlLiBZb3UgY2FuIGZvbGxvdyB0aGUgc3R5bGUgb2YgdGhpcyBub3RlIGZvciBub3RlIHRha2luZyBwdXJwb3NlLiBJbiB0aGUgZnJvbnQgbWF0dGVyIHBhcnQgb2YgdGhlIG1hcmtkb3duIGZpbGUsIGp1c3QgZm9sbG93IHRoaXMgbm9kZS5cbiIsInJlbWFya2FibGUiOiItLS1cbnN0eWxlOiB7fVxuZm9sbG93OlxuICAtIG5vdGVcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG4tLS1cblxuIyBNYXJrZG93biBzeW50YXggZXhhbXBsZSAmIHJlZmVyZW5jZVxuXG5CZWxvdyBhcmUgbW9zdGx5IGNvcGllZCBmcm9tIHJlbWFya2FibGUgZG9jdW1lbnQuXG5cbj4gRXhwZXJpZW5jZSByZWFsLXRpbWUgZWRpdGluZyB3aXRoIFJlbWFya2FibGUhXG5cbkNsaWNrIHRoZSBgY2xlYXJgIGxpbmsgdG8gc3RhcnQgd2l0aCBhIGNsZWFuIHNsYXRlLCBvciBnZXQgdGhlIGBwZXJtYWxpbmtgIHRvIHNoYXJlIG9yIHNhdmUgeW91ciByZXN1bHRzLlxuXG4qKipcblxuIyBoMSBIZWFkaW5nXG4jIyBoMiBIZWFkaW5nXG4jIyMgaDMgSGVhZGluZ1xuIyMjIyBoNCBIZWFkaW5nXG4jIyMjIyBoNSBIZWFkaW5nXG4jIyMjIyMgaDYgSGVhZGluZ1xuXG5cbiMjIEhvcml6b250YWwgUnVsZXNcblxuX19fXG5cbioqKlxuXG4qKipcblxuXG4jIyBUeXBvZ3JhcGhpYyByZXBsYWNlbWVudHNcblxuRW5hYmxlIHR5cG9ncmFwaGVyIG9wdGlvbiB0byBzZWUgcmVzdWx0LlxuXG4oYykgKEMpIChyKSAoUikgKHRtKSAoVE0pIChwKSAoUCkgKy1cblxudGVzdC4uIHRlc3QuLi4gdGVzdC4uLi4uIHRlc3Q/Li4uLi4gdGVzdCEuLi4uXG5cbiEhISEhISA/Pz8/ICwsXG5cblJlbWFya2FibGUgLS0gYXdlc29tZVxuXG5cIlNtYXJ0eXBhbnRzLCBkb3VibGUgcXVvdGVzXCJcblxuJ1NtYXJ0eXBhbnRzLCBzaW5nbGUgcXVvdGVzJ1xuXG5cbiMjIEVtcGhhc2lzXG5cbioqVGhpcyBpcyBib2xkIHRleHQqKlxuXG5fX1RoaXMgaXMgYm9sZCB0ZXh0X19cblxuKlRoaXMgaXMgaXRhbGljIHRleHQqXG5cbl9UaGlzIGlzIGl0YWxpYyB0ZXh0X1xuXG5+fkRlbGV0ZWQgdGV4dH5+XG5cblN1cGVyc2NyaXB0OiAxOV50aF5cblxuU3Vic2NyaXB0OiBIfjJ+T1xuXG4rK0luc2VydGVkIHRleHQrK1xuXG49PU1hcmtlZCB0ZXh0PT1cblxuXG4jIyBCbG9ja3F1b3Rlc1xuXG4+IEJsb2NrcXVvdGVzIGNhbiBhbHNvIGJlIG5lc3RlZC4uLlxuPj4gLi4uYnkgdXNpbmcgYWRkaXRpb25hbCBncmVhdGVyLXRoYW4gc2lnbnMgcmlnaHQgbmV4dCB0byBlYWNoIG90aGVyLi4uXG4+ID4gPiAuLi5vciB3aXRoIHNwYWNlcyBiZXR3ZWVuIGFycm93cy5cblxuXG4jIyBMaXN0c1xuXG5Vbm9yZGVyZWRcblxuKyBDcmVhdGUgYSBsaXN0IGJ5IHN0YXJ0aW5nIGEgbGluZSB3aXRoIGArYCwgYC1gLCBvciBgKmBcbisgU3ViLWxpc3RzIGFyZSBtYWRlIGJ5IGluZGVudGluZyAyIHNwYWNlczpcbiAgLSBNYXJrZXIgY2hhcmFjdGVyIGNoYW5nZSBmb3JjZXMgbmV3IGxpc3Qgc3RhcnQ6XG4gICAgKiBBYyB0cmlzdGlxdWUgbGliZXJvIHZvbHV0cGF0IGF0XG4gICAgKyBGYWNpbGlzaXMgaW4gcHJldGl1bSBuaXNsIGFsaXF1ZXRcbiAgICAtIE51bGxhIHZvbHV0cGF0IGFsaXF1YW0gdmVsaXRcbisgVmVyeSBlYXN5IVxuXG5PcmRlcmVkXG5cbjEuIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0XG4yLiBDb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXRcbjMuIEludGVnZXIgbW9sZXN0aWUgbG9yZW0gYXQgbWFzc2FcblxuXG4xLiBZb3UgY2FuIHVzZSBzZXF1ZW50aWFsIG51bWJlcnMuLi5cbjEuIC4uLm9yIGtlZXAgYWxsIHRoZSBudW1iZXJzIGFzIGAxLmBcblxuU3RhcnQgbnVtYmVyaW5nIHdpdGggb2Zmc2V0OlxuXG41Ny4gZm9vXG4xLiBiYXJcblxuXG4jIyBDb2RlXG5cbklubGluZSBgY29kZWBcblxuSW5kZW50ZWQgY29kZVxuXG4gICAgLy8gU29tZSBjb21tZW50c1xuICAgIGxpbmUgMSBvZiBjb2RlXG4gICAgbGluZSAyIG9mIGNvZGVcbiAgICBsaW5lIDMgb2YgY29kZVxuXG5cbkJsb2NrIGNvZGUgXCJmZW5jZXNcIlxuXG5gYGBcblNhbXBsZSB0ZXh0IGhlcmUuLi5cbmBgYFxuXG5TeW50YXggaGlnaGxpZ2h0aW5nXG5cbmBgYCBqc1xudmFyIGZvbyA9IGZ1bmN0aW9uIChiYXIpIHtcbiAgcmV0dXJuIGJhcisrO1xufTtcblxuY29uc29sZS5sb2coZm9vKDUpKTtcbmBgYFxuXG4jIyBUYWJsZXNcblxufCBPcHRpb24gfCBEZXNjcmlwdGlvbiB8XG58IC0tLS0tLSB8IC0tLS0tLS0tLS0tIHxcbnwgZGF0YSAgIHwgcGF0aCB0byBkYXRhIGZpbGVzIHRvIHN1cHBseSB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgcGFzc2VkIGludG8gdGVtcGxhdGVzLiB8XG58IGVuZ2luZSB8IGVuZ2luZSB0byBiZSB1c2VkIGZvciBwcm9jZXNzaW5nIHRlbXBsYXRlcy4gSGFuZGxlYmFycyBpcyB0aGUgZGVmYXVsdC4gfFxufCBleHQgICAgfCBleHRlbnNpb24gdG8gYmUgdXNlZCBmb3IgZGVzdCBmaWxlcy4gfFxuXG5SaWdodCBhbGlnbmVkIGNvbHVtbnNcblxufCBPcHRpb24gfCBEZXNjcmlwdGlvbiB8XG58IC0tLS0tLTp8IC0tLS0tLS0tLS0tOnxcbnwgZGF0YSAgIHwgcGF0aCB0byBkYXRhIGZpbGVzIHRvIHN1cHBseSB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgcGFzc2VkIGludG8gdGVtcGxhdGVzLiB8XG58IGVuZ2luZSB8IGVuZ2luZSB0byBiZSB1c2VkIGZvciBwcm9jZXNzaW5nIHRlbXBsYXRlcy4gSGFuZGxlYmFycyBpcyB0aGUgZGVmYXVsdC4gfFxufCBleHQgICAgfCBleHRlbnNpb24gdG8gYmUgdXNlZCBmb3IgZGVzdCBmaWxlcy4gfFxuXG5cbiMjIExpbmtzXG5cbltsaW5rIHRleHRdKGh0dHA6Ly9kZXYubm9kZWNhLmNvbSlcblxuW2xpbmsgd2l0aCB0aXRsZV0oaHR0cDovL25vZGVjYS5naXRodWIuaW8vcGljYS9kZW1vLyBcInRpdGxlIHRleHQhXCIpXG5cbkF1dG9jb252ZXJ0ZWQgbGluayBodHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL3BpY2EgKGVuYWJsZSBsaW5raWZ5IHRvIHNlZSlcblxuXG4jIyBJbWFnZXNcblxuIVtNaW5pb25dKGh0dHBzOi8vb2N0b2RleC5naXRodWIuY29tL2ltYWdlcy9taW5pb24ucG5nIFwiMjAwXCIpXG4hW1N0b3JtdHJvb3BvY2F0XShodHRwczovL29jdG9kZXguZ2l0aHViLmNvbS9pbWFnZXMvc3Rvcm10cm9vcG9jYXQuanBnIFwiMjAwXCIpXG5cbkxpa2UgbGlua3MsIEltYWdlcyBhbHNvIGhhdmUgYSBmb290bm90ZSBzdHlsZSBzeW50YXhcblxuIVtBbHQgdGV4dF1baWRdXG5cbldpdGggYSByZWZlcmVuY2UgbGF0ZXIgaW4gdGhlIGRvY3VtZW50IGRlZmluaW5nIHRoZSBVUkwgbG9jYXRpb246XG5cbltpZF06IGh0dHBzOi8vb2N0b2RleC5naXRodWIuY29tL2ltYWdlcy9kb2pvY2F0LmpwZyAgXCIyMDBcIlxuXG5cbiMjIEZvb3Rub3Rlc1xuXG5Gb290bm90ZSAxIGxpbmtbXmZpcnN0XS5cblxuRm9vdG5vdGUgMiBsaW5rW15zZWNvbmRdLlxuXG5JbmxpbmUgZm9vdG5vdGVeW1RleHQgb2YgaW5saW5lIGZvb3Rub3RlXSBkZWZpbml0aW9uLlxuXG5EdXBsaWNhdGVkIGZvb3Rub3RlIHJlZmVyZW5jZVtec2Vjb25kXS5cblxuW15maXJzdF06IEZvb3Rub3RlICoqY2FuIGhhdmUgbWFya3VwKipcblxuICAgIGFuZCBtdWx0aXBsZSBwYXJhZ3JhcGhzLlxuXG5bXnNlY29uZF06IEZvb3Rub3RlIHRleHQuXG5cblxuIyMgRGVmaW5pdGlvbiBsaXN0c1xuXG5UZXJtIDFcblxuOiAgIERlZmluaXRpb24gMVxud2l0aCBsYXp5IGNvbnRpbnVhdGlvbi5cblxuVGVybSAyIHdpdGggKmlubGluZSBtYXJrdXAqXG5cbjogICBEZWZpbml0aW9uIDJcblxuICAgICAgICB7IHNvbWUgY29kZSwgcGFydCBvZiBEZWZpbml0aW9uIDIgfVxuXG4gICAgVGhpcmQgcGFyYWdyYXBoIG9mIGRlZmluaXRpb24gMi5cblxuX0NvbXBhY3Qgc3R5bGU6X1xuXG5UZXJtIDFcbiAgfiBEZWZpbml0aW9uIDFcblxuVGVybSAyXG4gIH4gRGVmaW5pdGlvbiAyYVxuICB+IERlZmluaXRpb24gMmJcblxuXG4jIyBBYmJyZXZpYXRpb25zXG5cblRoaXMgaXMgSFRNTCBhYmJyZXZpYXRpb24gZXhhbXBsZS5cblxuSXQgY29udmVydHMgXCJIVE1MXCIsIGJ1dCBrZWVwIGludGFjdCBwYXJ0aWFsIGVudHJpZXMgbGlrZSBcInh4eEhUTUx5eXlcIiBhbmQgc28gb24uXG5cbipbSFRNTF06IEh5cGVyIFRleHQgTWFya3VwIExhbmd1YWdlXG5cblxuKioqXG5cbl9fQWR2ZXJ0aXNlbWVudCA6KV9fXG5cbi0gX19bcGljYV0oaHR0cHM6Ly9ub2RlY2EuZ2l0aHViLmlvL3BpY2EvZGVtby8pX18gLSBoaWdoIHF1YWxpdHkgYW5kIGZhc3QgaW1hZ2VcbiAgcmVzaXplIGluIGJyb3dzZXIuXG4tIF9fW2JhYmVsZmlzaF0oaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9iYWJlbGZpc2gvKV9fIC0gZGV2ZWxvcGVyIGZyaWVuZGx5XG4gIGkxOG4gd2l0aCBwbHVyYWxzIHN1cHBvcnQgYW5kIGVhc3kgc3ludGF4LlxuXG5Zb3UnbGwgbGlrZSB0aG9zZSBwcm9qZWN0cyEgOilcbiIsIm1hcmtkb3duIjoiLS0tXG5zdHlsZToge31cbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG5mb2xsb3c6XG4gIC0gbm90ZVxuLS0tXG5cblxuIyBOb2RlIGRlZmluZWQgYnkgbWFya2Rvd25cblxuVGhlIGNvbnRlbnQgb2YgZWFjaCBub2RlIGlzIGRlZmluZWQgaW4gYSBtYXJrZG93biBmaWxlLlxuXG4jIyBNYXJrZG93biBmaWxlIHN0cnVjdHVyZVxuXG5UaGUgbWFya2Rvd24gZmlsZSBoYXMgdHdvIHBhcnRzOlxuMS4gZnJvbnRtYXR0ZXJcbjIuIG1hcmtkb3duIGJvZHlcblxuVGhlIGZyb250bWF0dGVyIGRlZmluZXMgXG4xLiB0aGUgc3R5bGUgb2YgdGhlIG5vZGVcbjIuIHRoZSBzdWIgbm9kZXMgb2YgdGhlIG5vZGUgaWYgYW55XG4zLiB0aGUgb3V0bGluZSBvZiB0aGUgbm9kZSBpZiBhbnlcbjQuIHRoZSBlZGdlcyBhbW9uZyB0aGUgc3Vibm9kZXMgaWYgYW55XG5cblRoZSBtYXJrZG93biBib2R5IGRlZmlucyB0aGUgY29udGVudCB0byBiZSBzaG93biBmb3IgdGhpcyBub2RlLlxuXG4jIyBSZW1hcmthYmxlIG1hcmtkb3duIHBhcnNlclxuVGhlIFtyZW1hcmthYmxlIG1hcmtkb3duIHBhcnNlcl0oaHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvcmVtYXJrYWJsZSkgaXMgdXNlZCB0byByZW5kZXIgbWFya2Rvd24uIFRoZXJlIGFyZSBzb21lIGN1c3RvbWl6ZWQgZmVhdHVyZXMgaW4gbWFya2dyYXBoIG1hcmtkb3duLlxuXG4jIyMgVGhlIGltYWdlIGlzIHdpdGggYSBleHBsaWNpdCB3aWR0aCBwYXJhbWV0ZXIuXG5cbkZvciBleGFtcGxlOlxuIVtkZW1vIHBpY3R1cmVdKGh0dHBzOi8vb2N0b2RleC5naXRodWIuY29tL2ltYWdlcy9kb2pvY2F0LmpwZyAgXCIxMDBcIilcblxuYmVsb3cgaXMgdGhlIHNjcmlwdCB0byBzaG93IGFib3ZlIHBpY3R1cmUgaW4gMjAwcHggd2lkdGguIFlvdSBjYW4gY2hhbmdlIHRoZSAyMDAgcGFyYW10ZXIgdG8gYWRqdXN0IGl0J3Mgd2lkdGguIHRoZSBoZWlnaHQgd2lsbCBiZSBzZXQgYWNjb3JkaW5nbHkgdG9vLlxuYGBgXG4hW2RlbW8gcGljdHVyZV0oaHR0cHM6Ly9vY3RvZGV4LmdpdGh1Yi5jb20vaW1hZ2VzL2Rvam9jYXQuanBnICBcIjEwMFwiKVxuXG5gYGBcblxuPT1OT1RFPT0gVGhlIHBsYWNlIHRvIHB1dCB3aWR0aCBpcyBzdXBwb3NlZCB0byBiZSB0aGUgYWx0IHRleHQgaW4gb3JpZ2luYWwgcmVtYXJrYWJsZSBtYXJrZG93bi4gV2Ugbm8gbG9uZ2VyIHN1cHBvcnQgYWx0IHRleHQgaW4gaW1hZ2UuIFxuXG5UaGUgcmVtYXJrYWJsZSBwYWdlIGNhbiBiZSByZWZlcmVuY2UgZm9yIGFsbCB0aGUgbWFya2Rvd24gZmVhdHVyZXMgc3VwcG9ydGVkLlxuXG4jIyMgTWVybWFpZCBpcyBpbnRlZ3JhdGVkIGZvciBkaWFncmFtXG5cblRvIG1ha2UgZGlhZ3JhbSBlYXNpZXIsIHRoZSBtZXJtYWlkIGVuZ2luZSBpcyBpbnRlZ3JhdGVkIGludG8gbWFya2Rvd24uIHBsZWFzZSBjaGVjayBtZXJtYWlkIHBhZ2UgZm9yIHJlZmVyZW5jZS5cblxuXG4iLCJzdGlja3kiOiItLS1cbnN0eWxlOlxuICB3aWR0aDogMzAwcHhcbiAgaGVpZ2h0OiAzMDBweFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodHllbGxvd1xuICBwYWRkaW5nOiAxZW1cbiAgYm94LXNoYWRvdzogNXB4IDVweCA3cHggcmdiYSgzMywzMywzMywuNylcbiAgdHJhbnNmb3JtOiByb3RhdGUoLThkZWcpXG4gIGJvcmRlcjogMHB4XG4gIGJvcmRlci1yYWRpdXM6IDBweFxuICBsZWZ0OiA0NDNweFxuICB0b3A6IDgwcHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG4tLS1cblxuIyBOb3RlIDAwMVxuXG50aGlzIGlzIGEgbm90ZSBpbiB5ZWxsb3cuIGluIDNNIG5vdGUgY29sb3I/XG5cbllvdSBjYW4gYWp1c3QgY29sb3IsIHJvdGF0aW9uIHZpYSBmcm9udCBtYXR0ZXIgc3R5bGUgc2VjdGlvbi5cbiIsInB1cnBsZSBzdGlja3kiOiItLS1cbnN0eWxlOlxuICBiYWNrZ3JvdW5kLWNvbG9yOiBwbHVtXG4gIHRyYW5zZm9ybTogcm90YXRlKDJkZWcpXG4gIGxlZnQ6IDM3cHhcbiAgdG9wOiA5NHB4XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuZm9sbG93OlxuICAtIHN0aWNreVxuLS0tXG5cbiMgTm90ZSAwMDJcblxuU2V0IHdoaWNoIHN0aWNreSBub3RlcyBvbiB0aGUgdG9wIGJ5IGFkanVzdCB0aGUgc2VxdWVuY2UgaW4gdGhlIGZyb250IG1hdGVyIG5vdGVzIHNlY3Rpb24uIiwic3R5bGUiOiItLS1cbnN0eWxlOiB7fVxubm9kZXM6IFtdXG5lZGdlczogW11cbmZvbGxvdzpcbiAgLSBub3RlXG4tLS1cblxuXG5CZWxvdyBpcyBhIGxpc3Qgb2Ygb2Z0ZW4gdXNlZCBzdHlsZSBzZXR0aW5ncy5cblxuYGBgXG5cbiAgd2lkdGg6IDMwMHB4XG4gIGhlaWdodDogMzAwcHhcbiAgbGVmdDogMjU5cHhcbiAgdG9wOiAxMjZweFxuICBcbiAgYm94LXNoYWRvdzogNXB4IDVweCA3cHggcmdiYSgzMywzMywzMywuNylcbiAgdHJhbnNmb3JtOiByb3RhdGUoLThkZWcpXG5cbiAgYm9yZGVyOiAwcHggc29saWQgeWVsbG93XG4gIGJvcmRlcjogMnB4IGRhc2hlZCByZWRcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBib3gtc2hhZG93OiAwIDAgM3B4ICNjY2MgaW5zZXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHR5ZWxsb3c7XG4gIHRleHQtYWxpZ246IGxlZnRcbiAgcGFkZGluZy1sZWZ0OiAxMHB4XG4gIGxpbmUtaGVpZ2h0OiAxLjRcbiAgXG5gYGAiLCJzdGlja3kgbm90ZXMiOiItLS1cbnN0eWxlOiB7fVxubm9kZXM6XG4gIC0gbm93XG4gIC0gbGF0ZXJcbiAgLSBkb25lXG4gIC0gc3RpY2t5XG4gIC0gcHVycGxlIHN0aWNreVxuICAtIGdyZWVuIHN0aWNreVxuZWRnZXM6IFtdXG4tLS0iLCJncmVlbiBzdGlja3kiOiItLS1cbnN0eWxlOlxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbnllbGxvd1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgyZGVnKVxuICBsZWZ0OiA1MHB4XG4gIHRvcDogMTk3cHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG5mb2xsb3c6XG4gIC0gc3RpY2t5XG4tLS1cblxuIyBOb3RlIDAwM1xuXG5Zb3UgY2FuIGRyYWcgYW5kIGRyb3AgdG8gYWRqdXN0IHRoZSBwb3NpdGlvbiIsImdyYXBoIjoiLS0tXG5zdHlsZToge31cbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG5mb2xsb3c6XG4gIC0gbm90ZVxuLS0tXG5cbiIsImJhY2t1cCBhbmQgY29sbGFib3JhdGlvbiI6Ii0tLVxuc3R5bGU6IHt9XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuZm9sbG93OlxuICAtIG5vdGVcbi0tLVxuXG5cbiMgVXNlIENhc2VzIHRvIENvdmVyXG5cbjEuIElmIHRoZSBicm93c2VyIGlzIGNsb3NlZCBhY2NpZGVudGx5LCB3b3JrIHNob3VsZCBub3QgYmUgbG9zdC5cbjIuIEFibGUgdG8gYWNjZXNzIG1hcmtncmFwaCBkb2N1bWVudHMgaW4gcHVibGljIGNvbXB1dGVycywgd2hlbiB0cmF2ZWxsaW5nIHdpdGhvdXQgbXkgb3duIGNvbXB1dGVyIG9uIGhhbmQuXG4zLiBBYmxlIHRvIHNoYXJlIGRvY3VtZW50cyB3aXRoIGZyaWVuZHMgdG8gY29sbGFib3JhdGUuXG40LiBBYmxlIHRvIHNhdmUgc25hcHNob3RzIGFuZCByZXN0b3JlIGEgcHJldmlvdXMgc2F2ZWQgc25hcHNob3QuXG5cbiMgQmFja3VwIGFuZCBDb2xsYWJvcmF0aW9uIFJlbGF0ZWQgRmVhdHVyZXNcblxuIyMgQmFja3VwIGFuZCBSZXN0b3JlXG5cblVzZSB0aGUgdHdvIGJsYWNrIGJ1dHRvbnMgZm9yIGJhY2t1cCBhbmQgcmVzdG9yZS4gIFxuXG4tIENvbmNlcHR1YWxseSwgQmFja3VwIGlzIGxpa2UgYGdpdCBjb21taXRgLCAgYSBzbmFwc2hvcnQgb2YgY3VycmVudCB3b3JrIHdpbGwgYmUgc2F2ZWQgaW4gdGhlIGRhdGFiYXNlLlxuLSByZXN0b3JlIGlzIHNpbWlsYXIgdG8gYGdpdCBjaGVja291dCB2ZXJzb24uLmAsIGEgc25hcHNob3QgaW4gdGhlIGRhdGFiYXNlIHdpbGwgYmUgcmVzdG9yZWQgdG8gY3VycmVudCB3b3Jrc3BhY2UuXG5cbiFbUmVzdG9yZV0ocmVzdG9yZS5qcGcgXCI0MDBcIilcblxuIyMgU2hhcmVcblxuSWYgeW91IGNsaWNrIHRoZSBibHVlIFNoYXJlIGJ1dHRvbiwgYSBkaWFsb2cgd2lsbCBiZSBzaG93biB3aXRoIGEgbG9uZyBVUkwuICBUaGUgVVJMIGlzIHdpdGggYmFzZTY0IGVuY29kZWQgZGF0YSBmb3IgY3VycmVudCBub3Rlcy4gIFRoaXMgVVJMIGNhbiBiZSBzaGFyZWQuIFxuQ29uY2VwdHVhbGx5LCB0aGUgVVJMIGlzIGxpa2UgYSBNUyBXT1JEIGRvY3VtZW50LCBvciBhIExhdGV4IGRvY3VtZW50LiBJdCBjYW4gYmUgb3BlbiBieSBtYXJrZ3JhcGguXG5cbiFbU2hhcmVdKHNoYXJlLmpwZyBcIjQwMFwiKVxuXG4jIyBFeHBvcnQgYW5kIEltcG9ydFxuXG4tIEV4cG9ydCBpcyBzaW1pbGFyIHRvIGJhY2t1cCwgYnV0IGl0J3Mgbm90IHVzaW5nIHRoZSBpbnRlcm5hbCBkYXRhYmFzZSwgYnV0IHVzaW5nIGV4dGVybmFsIHRleHQgZmlsZSwgaW4gSlNPTiBmb3JtYXQuXG4tIFRoZSBmaWxlIGV4cG9ydGVkIGNhbiBiZSBpbXBvcnRlZCBpbiBhIGxhdGVyIHN0YWdlLiBUaGUgaW1wb3J0IHByb2Nlc3Mgd2lsbCBjcmVhdGUgYSBuZXcgc25hcHNob3QgaW4gdGhlIGludGVybmFsIGRhdGFiYXNlIGZvciB5b3UgZnVydGhlciByZXN0b3JlLlxuXG4hW0ltcG9ydF0oaW1wb3J0LmpwZyBcIjQwMFwiKVxuIiwiYnJvd3NlciI6Ii0tLVxuc3R5bGU6XG4gIHRleHQtYWxpZ246IHJpZ2h0XG4gIHBhZGRpbmctcmlnaHQ6IDEwcHhcbiAgYm9yZGVyOiAxcHggZGFzaGVkXG4gIHdpZHRoOiAyMDBweFxuICBoZWlnaHQ6IDM1MHB4XG4gIGxlZnQ6IDcycHhcbiAgdG9wOiAxMjNweFxuICBib3gtc2hhZG93OiAwIDAgMnB4XG4gIHotaW5kZXg6IDJcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG4tLS1cblxuIVtdKGh0dHBzOi8vdHNlNC1tbS5jbi5iaW5nLm5ldC90aC9pZC9PSVAtQy5xdUdRMS1rU1pfQ3ZQeHNhQzdDaE53QUFBQT9waWQ9SW1nRGV0JnJzPTEgXCI1MFwiKVxuXG5icm93c2VyIiwicG91Y2hkYiI6Ii0tLVxuc3R5bGU6XG4gIHdpZHRoOiAxMDBweFxuICBoZWlnaHQ6IDEwMHB4XG4gIGxlZnQ6IDc3cHhcbiAgdG9wOiAzNTBweFxuICBib3gtc2hhZG93OiAwIDAgMHB4XG4gIGJvcmRlcjogMHB4XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuLS0tXG5cbiFbXShodHRwczovL3RzZTItbW0uY24uYmluZy5uZXQvdGgvaWQvT0lQLUMuczg3ZXhRdzY2S1R5aFBiSnBTeXI5UUFBQUE/cGlkPUltZ0RldCZycz0xKVxuXG5Qb3VjaERCIGluIEJyb3dzZXIiLCJsb2NhbHN0b3JhZ2UiOiItLS1cbnN0eWxlOlxuICB3aWR0aDogMTAwcHhcbiAgaGVpZ2h0OiAxMDBweFxuICBsZWZ0OiA4OXB4XG4gIHRvcDogMTYzcHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG5mb2xsb3c6XG4gIC0gcG91Y2hkYlxuLS0tXG5cbiFbXShodHRwczovL3RzZTItbW0uY24uYmluZy5uZXQvdGgvaWQvT0lQLUMuNnM1VjBSYW82ckFweks3X3lETHpOd0FBQUE/cGlkPUltZ0RldCZycz0xKVxuXG5Ccm93c2VyIExvY2FsIFN0b3JhZ2UiLCJhcmNoaXRlY3R1cmUiOiItLS1cbnN0eWxlOiB7fVxubm9kZXM6XG4gIC0gY29tcHV0ZXJcbiAgLSBicm93c2VyXG4gIC0gcG91Y2hkYlxuICAtIGxvY2Fsc3RvcmFnZVxuICAtIGRpc2tcbiAgLSBjb3VjaGRiXG4gIC0gZ2l0aHViXG4gIC0gYWN0b3JcbiAgLSBub3RlIHN0b3JhZ2VcbmVkZ2VzOlxuICAtIGZyb206IGFjdG9yXG4gICAgdG86IGxvY2Fsc3RvcmFnZVxuICAgIGxhYmVsOiAxLiBFdmVyeSBLZXlzdHJva2Ugc2F2ZWQgd2l0aGluIDEgc2Vjb25kLlxuICAtIGZyb206IGFjdG9yXG4gICAgdG86IHBvdWNoZGJcbiAgICBsYWJlbDogMi4gQmFja3VwL3Jlc3RvcmUgd29ya3NwYWNlIHNuYXBzaG90XG4gIC0gZnJvbTogZGlza1xuICAgIHRvOiBwb3VjaGRiXG4gICAgbGFiZWw6IDQuIGltcG9ydCB0byBzbmFwc2hvdFxuICAtIGZyb206IGJyb3dzZXJcbiAgICB0bzogZGlza1xuICAgIGxhYmVsOiAzLiBleHBvcnQgdG8gZGlza1xuICAtIGZyb206IGRpc2tcbiAgICB0bzogZ2l0aHViXG4gICAgbGFiZWw6IDUuIGJhY2t1cCBleHBvcnRlZCBmaWxlIGluIHRoZSBjbG91ZFxuICAtIGZyb206IHBvdWNoZGJcbiAgICB0bzogY291Y2hkYlxuICAgIGxhYmVsOiA3LiByZWFsdGltZSBzeW5jXG4gICAgcGFpbnRTdHlsZTpcbiAgICAgIHN0cm9rZVdpZHRoOiAyXG4gICAgICBzdHJva2U6IGJsYWNrXG4gICAgICBkYXNoc3R5bGU6IDQgMlxuICAtIGZyb206IGNvdWNoZGJcbiAgICB0bzogZ2l0aHViXG4gICAgbGFiZWw6IDguIGF1dG8gYmFja3VwXG4gICAgcGFpbnRTdHlsZTpcbiAgICAgIHN0cm9rZVdpZHRoOiAyXG4gICAgICBzdHJva2U6IGJsYWNrXG4gICAgICBkYXNoc3R5bGU6IDQgMlxuICAtIGZyb206IGFjdG9yXG4gICAgdG86IGdpdGh1YlxuICAgIGxhYmVsOiA2LiBmZXRjaCBiYWNrdXAgc25hcHNob3QsIGltcG9ydCBhbmQgcmVzdW1lIHdvcmtcbi0tLSIsImRpc2siOiItLS1cbnN0eWxlOlxuICB3aWR0aDogMTAwcHhcbiAgaGVpZ2h0OiAxMDBweFxuICBsZWZ0OiAzNjNweFxuICB0b3A6IDQxMnB4XG4gIGJveC1zaGFkb3c6IDAgMCAwcHhcbiAgYm9yZGVyOiAwcHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG4tLS1cblxuIVtdKGh0dHBzOi8vdHMxLmNuLm1tLmJpbmcubmV0L3RoL2lkL1ItQy5hYTU0YmU2MzI2NDk5OGM4OWQ2NjhjMWY0YjhkYjM2Yz9yaWs9SVZGUzkxayUyYnU0S1pLZyZyaXU9aHR0cCUzYSUyZiUyZmljb25zLmljb25hcmNoaXZlLmNvbSUyZmljb25zJTJmaGFtemFzYWxlZW0lMmZzdG9jay1zdHlsZS0zJTJmMTI4JTJmRmluZGVyLWljb24ucG5nJmVoaz1JNjVCU3MlMmZTZURINmtTZjN3b2pMc0pPV0p4RTAzRGM1U1BtR0Y0Y1ViOXMlM2QmcmlzbD0mcGlkPUltZ1JhdyZyPTAgXCI4MFwiKVxuXG5Mb2NhbCBGaWxlIiwiZ2l0aHViIjoiLS0tXG5zdHlsZTpcbiAgaGVpZ2h0OiA3MHB4XG4gIGxlZnQ6IDc1NHB4XG4gIHRvcDogNTE4cHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG5mb2xsb3c6XG4gIC0gcG91Y2hkYlxuLS0tXG5cbiFbXShodHRwczovL3RzMS5jbi5tbS5iaW5nLm5ldC90aC9pZC9SLUMuZDM5NmY5MDQ3Mzc4ZTU4ZDI1OGMzZTI3MjAzYzQzZjA/cmlrPURrOEQ0Y2pxMnFVV25BJnBpZD1JbWdSYXcmcj0wKSIsImNvdWNoZGIiOiItLS1cbnN0eWxlOlxuICBsZWZ0OiA5NTZweFxuICB0b3A6IDMxNXB4XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuZm9sbG93OlxuICAtIHBvdWNoZGJcbi0tLVxuXG4hW10oaHR0cHM6Ly9jb3VjaGRiLmFwYWNoZS5vcmcvaW1hZ2UvY291Y2hAMngucG5nIFwiODBcIilcbkNvdWNoREIiLCJhY3RvciI6Ii0tLVxuc3R5bGU6XG4gIGxlZnQ6IDg1M3B4XG4gIHRvcDogMjE3cHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG5mb2xsb3c6XG4gIC0gcG91Y2hkYlxuLS0tXG5cblxuIVtdKGh0dHBzOi8vdHMxLmNuLm1tLmJpbmcubmV0L3RoL2lkL1ItQy40Y2MzNWRkN2MyNDUyZTZkOGVlZGUzZGZjOTVhZTA3ZD9yaWs9c1d6OXIxenZpRXVaZXcmcGlkPUltZ1JhdyZyPTAgXCI4MFwiKVxuXG5Eb2N1bWVudCBXcml0ZXIiLCJjb21wdXRlciI6Ii0tLVxuc3R5bGU6XG4gIHRleHQtYWxpZ246IHJpZ2h0XG4gIHBhZGRpbmctcmlnaHQ6IDEwcHhcbiAgYm9yZGVyOiAxcHggc29saWRcbiAgbGVmdDogNjRweFxuICB0b3A6IDExMXB4XG4gIHdpZHRoOiA0MDBweFxuICBoZWlnaHQ6IDQwMHB4XG4gIHotaW5kZXg6IDFcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG4tLS1cblxuTG9jYWwgQ29tcHV0ZXIiLCJTdG9yYWdlIEFyY2hpdGVjdHVyZSI6Ii0tLVxuc3R5bGU6IHt9XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuLS0tIiwiTWFya2Rvd24gU3VwcG9ydCI6Ii0tLVxuc3R5bGU6IHt9XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuLS0tIiwidWkiOiItLS1cbnN0eWxlOiB7fVxubm9kZXM6XG4gIC0gdWkgc2NyZWVuXG4gIC0gbm90ZSBleHBsb3JlclxuICAtIG5vdGUgbWVudVxuICAtIG5vdGUgZWRpdG9yXG4gIC0gbm90ZSBjYW52YXNcbiAgLSBub3RlIG91dGxpbmVcbiAgLSBub3RlIGJ1dHRvblxuZWRnZXM6IFtdXG5mb2xsb3c6XG4gIC0gbm90ZVxuLS0tIiwidWkgc2NyZWVuIjoiLS0tXG5zdHlsZTpcbiAgd2lkdGg6IDgwMHB4XG4gIGhlaWdodDogNTAwcHhcbiAgbGVmdDogMTAwcHhcbiAgdG9wOiAxMDBweFxubm9kZXM6IFtdXG5lZGdlczogW11cbi0tLVxuXG4hW10oLi9tYXJrZ3JhcGguanBnKSIsIm5vdGUgZXhwbG9yZXIiOiItLS1cbnN0eWxlOlxuICB3aWR0aDogMTIwcHhcbiAgaGVpZ2h0OiAxNTBweFxuICBsZWZ0OiAxMDhweFxuICB0b3A6IDQ4MXB4XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuZm9sbG93OlxuICAtIHVpIHN0aWNreVxuLS0tXG5cbiMjIyBFeHBsb3JlclxuXG4tIFNob3dzIHRoZSBub2RlIGxpc3Qgb3Igbm90ZXMgbGlzdC4gXG4tIENsaWNrIGJsdWUgTm90ZXMgdG8gc2hvdyBub3Rlcy4gIiwibm90ZSBtZW51IjoiLS0tXG5zdHlsZTpcbiAgd2lkdGg6IDEwMHB4XG4gIGhlaWdodDogMTAwcHhcbiAgdHJhbnNmb3JtOiByb3RhdGUoM2RlZylcbiAgbGVmdDogMjU2cHhcbiAgdG9wOiAzMjZweFxubm9kZXM6IFtdXG5lZGdlczogW11cbmZvbGxvdzpcbiAgLSB1aSBzdGlja3lcbi0tLVxuXG4jIyMgTWVudVxuXG5SaWdodCBjbGljayBvbiBvbmUgbm9kZS9ub3RlcyBpbnNpZGUgdGhlIGV4cGxvcmVyIHRvIHNob3cuIiwibm90ZSBlZGl0b3IiOiItLS1cbnN0eWxlOlxuICB3aWR0aDogMTAwcHhcbiAgaGVpZ2h0OiAxMDBweFxuICBsZWZ0OiA0MThweFxuICB0b3A6IDIxN3B4XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuZm9sbG93OlxuICAtIHVpIHN0aWNreVxuLS0tXG5cbiMjIyBFZGl0b3JcblxuQ2FuIGJlIHNob3duL2hpZGUgYnkgdGhlIGJsdWUgZWRpdG9yIGJ1dHRvbiIsIm5vdGUgY2FudmFzIjoiLS0tXG5zdHlsZTpcbiAgd2lkdGg6IDE1MHB4XG4gIGhlaWdodDogMTUwcHhcbiAgdHJhbnNmb3JtOiByb3RhdGUoLThkZWcpXG4gIGxlZnQ6IDY0NnB4XG4gIHRvcDogNDE0cHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG5mb2xsb3c6XG4gIC0gdWkgc3RpY2t5XG4tLS1cblxuIyMjIENhbnZhc1xuXG4tIENhbiBiZSBzaG93bi9oaWRlL2Zyb3plbiBieSB0aGUgYmx1ZSBDYW52YXMgYnV0dG9uLlxuLSBGcm96ZW4gbWVhbnMgdGhlIGNvbnRlbnQgd2lsbCBub3QgY2hhbmdlZCBieSBjdXJyZW50IGFjdGl2ZSBkb2N1bWVudC4iLCJub3RlIG91dGxpbmUiOiItLS1cbnN0eWxlOlxuICB3aWR0aDogMTUwcHhcbiAgaGVpZ2h0OiAxNTBweFxuICB0cmFuc2Zvcm06IHJvdGF0ZSgtM2RlZylcbiAgbGVmdDogNzQ4cHhcbiAgdG9wOiAyNTdweFxubm9kZXM6IFtdXG5lZGdlczogW11cbmZvbGxvdzpcbiAgLSB1aSBzdGlja3lcbi0tLVxuXG4jIyMgT3V0bGluZVxuXG4tIENhbiBiZSBzaG93bi9oaWRlL2Zyb3plbiBieSB0aGUgYmx1ZSBPdXRsaW5lIGJ1dHRvbi5cbi0gRnJvemVuIG1lYW5zIHRoZSBjb250ZW50IHdpbGwgbm90IGNoYW5nZWQgYnkgY3VycmVudCBhY3RpdmUgZG9jdW1lbnQuIiwibm90ZSBidXR0b24iOiItLS1cbnN0eWxlOlxuICB3aWR0aDogMzAwcHhcbiAgaGVpZ2h0OiA5MHB4XG4gIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpXG4gIGxlZnQ6IDMyOXB4XG4gIHRvcDogNTRweFxubm9kZXM6IFtdXG5lZGdlczogW11cbmZvbGxvdzpcbiAgLSB1aSBzdGlja3lcbi0tLVxuXG4jIyMgdG9vbGJhclxuXG4tIEEgbGlzdCBvZiBidXR0b25zLiBcbi0gTm90ZSB0aGUgdHdvIGJsYWNrIGJ1dHRvbiBhcmUgZm9yIHRha2Ugc25hcHNob3QgYW5kIHJlc3RvcmUgYSBwcmV2aW91cyBzYXZlZCBzbmFwc2hvdC5cbiIsInVpIHN0aWNreSI6Ii0tLVxuc3R5bGU6XG4gIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0eWVsbG93XG4gIHBhZGRpbmc6IDFlbVxuICBib3gtc2hhZG93OiA1cHggNXB4IDdweCByZ2JhKDMzLDMzLDMzLC43KVxuICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKVxuICBib3JkZXI6IDBweFxuICBib3JkZXItcmFkaXVzOiAwcHhcbiAgdGV4dC1hbGlnbjogbGVmdFxubm9kZXM6IFtdXG5lZGdlczogW11cbi0tLVxuXG4jIFRlbXBsYXRlXG5cblRleHQgZGVzY3JpcHRpb25cblxuLSBpdGVtIDFcbi0gaXRlbSAyIiwiIjoiLS0tXG5zdHlsZToge31cbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG4tLS0iLCJub3RlIHN0b3JhZ2UiOiItLS1cbnN0eWxlOlxuICB3aWR0aDogNTAwcHhcbiAgaGVpZ2h0OiAxOTBweFxuICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKVxuICBsZWZ0OiA1MTRweFxuICB0b3A6IDIxcHhcbiAgcGFkZGluZy10b3A6IDBweFxubm9kZXM6IFtdXG5lZGdlczogW11cbmZvbGxvdzpcbiAgLSB1aSBzdGlja3lcbi0tLVxuXG4jIyMgTm90ZVxuXG4xLiB3b3JrIGF1dG8gc2F2ZWQgaW4gYnJvd3NlciBsb2NhbCBzdG9yYWdlLiBcbjIuICoqYmFja3VwKiogd2lsbCBjcmVhdGUgYSBuZXcgdmVyc2lvbiBpbiBwb3VjaGRiLCAqKnJlc3RvcmUqKiBjYW4gc2VsZWN0IHZlcnNpb24uXG4zLiAqKmV4cG9ydCoqIHdpbGwgZG93bmxvYWQgY3VycmVudCB3b3Jrc3BhY2UgdG8gbG9jYWwgZmlsZSBzeXN0ZW0sIGluIEpTT04gZm9ybWF0LlxuNC4gdGhlIGV4cG9ydGVkIEpTT04gZmlsZSBjYW4gYmUgKippbXBvcnRlZCoqIHRvIHRoZSBwb3VjaGRiLCBhcyBhIG5ldyBzbmFwc2hvdCwgYW5kIGNhbiBiZSBmdXJ0aGVyIHJlc3RvcmVkLlxuNS4gdGhlIGV4cG9ydGVkIEpTT04gZmlsZSBjYW4gYmUgdmVyc2lvbiBjb250cm9sZWQuXG42LiBpbiBjYXNlIHRyYXZlbGxpbmcsIGNhbiBhbHdheXMgZ2V0IGEgc25hcHNob3QoSlNPTiBmaWxlKSBhbmQgaW1wb3J0IHRvIHJlc3VtZSB3b3JrLlxuNy4gYSBjb3VjaGRiIGNhbiBiZSBjb25maWd1cmVkIHRvIHN5bmMgZGF0YSB3aXRoIHBvdWNoZGIgaW4gcmVhbHRpbWUuXG44LiB0aGUgZGF0YSBpbiBjb3VjaGRiIGNhbiBiZSBhdXRvIHZlcnNpb24gY29udHJvbGxlZCBieSBhIHNjcmlwdC5cblxuKjcgYW5kIDggYXJlIHRvIGJlIGltcGxlbWVudGVkIHdoZW4gYSBnb29kIGNvdWNoZGIgU2FhUyBpcyBhdmFpbGFibGUuKlxuIiwibm93IjoiLS0tXG5zdHlsZTpcbiAgbGVmdDogODA3cHhcbiAgdG9wOiA2cHhcbiAgd2lkdGg6IDQwMHB4XG4gIGhlaWdodDogODAwcHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG4tLS1cblxuKipEb25lKioiLCJsYXRlciI6Ii0tLVxuc3R5bGU6XG4gIGxlZnQ6IDFweFxuICB0b3A6IDZweFxuICB3aWR0aDogNDAwcHhcbiAgaGVpZ2h0OiA4MDBweFxubm9kZXM6IFtdXG5lZGdlczogW11cbi0tLVxuXG4qKkxhdGVyKioiLCJkb25lIjoiLS0tXG5zdHlsZTpcbiAgbGVmdDogNDA0cHhcbiAgdG9wOiA2cHhcbiAgd2lkdGg6IDQwMHB4XG4gIGhlaWdodDogODAwcHhcbm5vZGVzOiBbXVxuZWRnZXM6IFtdXG4tLS1cblxuKipOb3cqKiIsImRldmVsb3BlciI6Ii0tLVxuc3R5bGU6IHt9XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuZm9sbG93OlxuICAtIG5vdGVcbi0tLVxuXG4jIyBIb3cgVG9cblxuIyMjIEJ1aWxkXG5gYGBcbm5wbSBydW4gYnVpbGRcbmBgYFxuXG4jIyMgVW5pdCBUZXN0XG5cbkl0J3Mgbm90IGZ1bGx5IHVuaXQgdGVzdGVkLCBidXQgdGhlcmUgYXJlIHNvbWUgSmVzdCB0ZXN0IGNhc2VzIGluIHRlc3QgZm9sZGVyLlxuXG5JIHVzdWFsbHkgcnVuIHRlc3QgZnJvbSBjb21tYW5kIGxpbmUuIGZvciBleGFtcGxlOlxuXG5gYGBcbm5weCBqZXN0IC0tbm8tY2FjaGUgLS12ZXJib3NlIG1vZGVsLnRlc3QuanNcbm5weCBqZXN0IC0tbm8tY2FjaGUgLS12ZXJib3NlIHRpbWVtYWNoaW5lLnRlc3QuanNcbmBgYFxuXG4jIyMgTmV3IEZlYXR1cmVzICYgQnVnc1xuXG5QbGVhc2UgZmVlbCBmcmVlIHRvIHJhaXNlIGlzc3VlIG9yIHB1bGwgcmVxdWVzdCBbaGVyZS5dKGh0dHBzOi8vZ2l0aHViLmNvbS94dTR3YW5nL21hcmtncmFwaClcblxuXG4jIyBSZWZlcmVuY2VcblxuXG4tIGh0dHBzOi8vZ2l0aHViLmNvbS9qc3BsdW1iL2pzcGx1bWJcbi0gaHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvcmVtYXJrYWJsZVxuLSBodHRwczovL21lcm1haWQtanMuZ2l0aHViLmlvL21lcm1haWQvXG4tIGh0dHBzOi8vcG91Y2hkYi5jb20vXG4tIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlY2EvanMteWFtbFxuLSBodHRwczovL2NsdXN0ZXJpemUuanMub3JnL1xuLSBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDJcbi0gaHR0cHM6Ly9naXRodWIuY29tL20tdGhhbG1hbm4vY29udGV4dG1lbnVqc1xuXG5cblxuIn0=';


store.init({
  active: null,   //name of current active node
  impacted: null,  //the node being impacted
  documents: {}
});

function parse(text, options, loadSafe) {
  let contentKeyName = options && typeof options === 'string'
    ? options
    : options && options.contentKeyName
      ? options.contentKeyName
      : '__content';

  //eslint-disable-next-line
  let passThroughOptions = options && typeof options === 'object' ? options : undefined;

  let re = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/,
      results = re.exec(text),
      conf = {},
      yamlOrJson;

  if ((yamlOrJson = results[2])) {
    if (yamlOrJson.charAt(0) === '{') {
      conf = JSON.parse(yamlOrJson);
    } else if (loadSafe) {
      conf = jsyaml.safeLoad(yamlOrJson, passThroughOptions);
    } else {
      conf = jsyaml.load(yamlOrJson, passThroughOptions);
    }
  }

  conf[contentKeyName] = results[3] || '';

  return conf;
}

function loadFront(content, options) {
  return parse(content, options, false);
}

/*---------------------- A Wrapper of the model ------------------------*/

function get_documents() {
  //return a list of objects { name, type, content }
  return store.get_store().documents;
}

/*
each doc has 2 attrs:

body:  markdown part
json:  front matter part in JSON

*/

function _update_document(docs, name, content) {
  //TODO need to check 'follow' attributes, prevent loop inherit
  var h;

  try {
    h = loadFront(content);
  } catch (error) {
    h = {};
    h.__content = content;
  }

  docs[name] = {
    body: h.__content
    //content: content
  };

  if (!h.style) {
    h['style'] = {};
  }
  if (!h.nodes) {
    h['nodes'] = [];
  }
  if (!h.edges) {
    h['edges'] = [];
  }

  delete h.__content;
  //docs[name].error = false;
  docs[name].json = h;   //...json.nodes = ['n1','n2',...]

  return { impacted: name, documents: docs };
}

function get_document_content(id) {
  var diagram_documents = get_documents();
  if (diagram_documents[id]) {
    var ret = '';
    if (Object.keys(diagram_documents[id].json).length !== 0) {
      ret = '---\n' + jsyaml.dump(diagram_documents[id].json) + '---';
    }
    return ret + diagram_documents[id].body;
  }
  return '';
}

function build_doc() {
  //generate string data
  var obj = {};
  var documents = get_documents();
  for (const el in documents) {
    if (documents.hasOwnProperty(el)) {
      obj[el] = get_document_content(el);  //the string with node body markdown and frontmatter
    }
  }
  var obj_str = JSON.stringify(obj);
  return obj_str;
}

function get_doc(name) {
  name = name || notes_name;
  return storage.get(name);
}

function get_doc_obj(name) {
  let s = get_doc(name);
  return JSON.parse(s);
}

function get_b64() {
  return base64.encode(get_doc());
}

function update_storage(name, data) {
  name = name || notes_name;
  data = data || build_doc();
  if (data instanceof Object) {
    data = JSON.stringify(data);
  }
  storage.set(name, data);
  store.emit('STORAGE_UPDATE', {});
}



//  store.emit('ACTIVE-DOCUMENT', () => ({ active : name }));
function update_document(name, content) {
  name = String(name);
  store.emit('DOCUMENT-UPDATE', ({ documents }) => (_update_document(documents, name, content)));
  update_storage();
}

function get_subnode_names(id) {
  var diagram_documents = get_documents();
  if (diagram_documents[id]) {
    if (diagram_documents[id].json.nodes) {
      return diagram_documents[id].json.nodes;
    }
  }
  return [];
}


function get_document_body(id) {
  var diagram_documents = get_documents();

  if (diagram_documents[id]) {
    return diagram_documents[id].body;
  }
  return '';
}

function set_active_document(name, notes) {
  if (notes && notes !== '' && notes !== notes_name) {
    // eslint-disable-next-line no-use-before-define
    _reset(notes);
  }
  store.emit('ACTIVE-DOCUMENT', () => ({ active : name }));
  //check if it's a notes package???
  /*
  if (storage.getItem(name) !== null) {
    //open the note pacakge named target_doc
    // eslint-disable-next-line no-use-before-define
    reset(name);
  }
  */
}

function get_active_document() {
  return store.get_store().active;
}

function get_impacted_document() {
  return store.get_store().impacted;
}

function get_document_obj(id, create) {
  var documents = get_documents();
  if (!documents[id]) {
    //update_document(id, '');
    if (create) {
      update_document(id, '');
    } else {
      return {};
    }
  }
  return documents[id].json;
}

function update_attr(id, key, value) {
  //update JSON object first,
  //update yaml accordingly
  var obj = get_document_obj(id)['style'];
  obj[key] = value;
  update_storage();
}

function set_common_attr(id, key, value) {
  var obj = get_document_obj(id, true);
  obj[key] = value;
  update_storage();
}

function get_attr(id, key) {
  //read node attr, if not available return the default attr value
  var obj = get_document_obj(id)['style'];
  var parent = get_document_obj(id)['follow'];

  var r = obj[key];
  if (r) return r;

  if (parent) {
    for (let f of parent) {
      let r = get_attr(f, key);
      if (r) return r;
    }
  }
  return r;
}

function get_attrs(id) {
  var obj = get_document_obj(id)['style'];
  var parent = get_document_obj(id)['follow'];

  if (parent) {
    for (let f of parent) {
      let r = get_attrs(f);
      obj = Object.assign({}, r, obj);
    }
  }
  return obj;
}

function get_edges(doc) {
  var documents = get_documents();

  if (documents[doc].json.edges) {
    return documents[doc].json.edges;
  }
  return [];
}

function get_common_attr(name, key) {
  var docs = get_documents();
  if (docs[name]) {
    return docs[name].json[key];
  }
  return '';
}

function get_outline(name) {
  name = name || get_active_document();
  var docs = get_documents();
  if (docs[name]) {
    let r = docs[name].json['outline'] || {};
    return r;
  }
  return {};
}

function get_all_names() {
  var docs = get_documents();
  var ret = new Set();
  for (let d in docs) {
    if (docs.hasOwnProperty(d)) {
      ret.add(d);
      /* subnode will not be added automatically.
      for (let s of get_subnode_names(d)) {
        ret.add(s);
      }
      */
    }
  }
  var ret2 = {};
  for (let k of ret) {
    ret2[k] = get_common_attr(k, 'note') || '';
  }
  return ret2;
}


function get_config(key) {
  return get_common_attr(config_file, key);
}

function set_config(key, value) {
  set_common_attr(config_file, key, value);
  store.emit('DOCUMENT-UPDATE', () => ({}));
  update_storage();
}

function rename_document(src, target) {
  if (src === target) return;
  store.emit('DOCUMENT-RENAME', (s) => {
    s.documents[target] = s.documents[src];
    let keep = get_common_attr(config_file, 'keep');
    if (keep instanceof Array) {
      if (!(get_common_attr(config_file, 'keep').includes(src))) {
        delete s.documents[src];
      }
    }
    update_storage();
    return s;
  });
}

function delete_document(name) {
  store.emit('DOCUMENT-DELETE', (s) => {
    let keep = get_common_attr(config_file, 'keep');
    if (keep instanceof Array) {
      if (!(get_common_attr(config_file, 'keep').includes(name))) {
        delete s.documents[name];
        s.impacted = name;
      }
    }
    update_storage();
    return s;
  });
}

function document_available(name) {
  var docs = get_documents();
  return name in docs;
}

function allocation_name() {
  let current = new Date();
  let cDate = current.getFullYear() + '_' + (current.getMonth() + 1) + '_' + current.getDate();
  let cTime = current.getHours() + '_' + current.getMinutes() + '_' + current.getSeconds();
  let dateTime = cDate + '_' + cTime;
  return dateTime;
}

function init_from_permlink(obj_str) {
  try {
    //var obj_str = base64.decode(b64);
    var obj = JSON.parse(obj_str);
    if (obj) {
      for (let n in obj) {
        if (obj.hasOwnProperty(n)) {
          update_document(n, obj[n]);
        }
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}

function format(hard) {
  if (hard) {
    store.reset_listener();
  }
  store.emit('FORMAT', { documents: {} });
}

//name is the new name after reset
/*

1. ('', false) : open default notes
2. ('name',false) : open name, if not available, init it using default b64 data.
3. ('name', 'b64 data') : assign b64 data to name in storage, and open name.
4. ('', 'b64 data') : allocate a name and assign b64 data, open it.

*/
function _reset(name, b64) {
  let notes_data = '';
  store.emit('RESET', {});
  format();

  name = name || '';

  if (name === '') {
    if (b64) {
      //case #4
      notes_name = allocation_name();
      notes_data = base64.decode(b64);
    } else {
      //case #1
      notes_name = default_name;  //use default name;
      notes_data = storage.get(notes_name);
    }
  } else {
    //name is not blank, #2 or #3
    notes_name = name;
    if (b64) {
      notes_data = base64.decode(b64);
    } else {
      notes_data = storage.get(name);
    }
  }


  //init and make sure notes_data is valid
  if (!init_from_permlink(notes_data)) {
    notes_data = base64.decode(default_b64);
    init_from_permlink(notes_data);
  }

  //make sure we have config file, 'diagram.system.configuration'
  let cf = get_config('keep');
  if (cf === '') {
    set_config('keep', [ config_file ]);
  }

  storage.set(notes_name, notes_data);
  store.emit('OPEN-NOTES', {});
}

function reset(name, b64) {
  _reset(name, b64);
  set_active_document(frontpage);
}

function get_notes_name() {
  return notes_name;
}

function duplicate_notes(src, target) {
  if (storage.get(src) !== null) {
    let v = storage.get(src);
    storage.set(target, v);
  }
  store.emit('DOCUMENT-UPDATE', {});
}

function new_notes(name) {
  duplicate_notes(default_name, name);
  store.emit('DOCUMENT-UPDATE', {});
}

function delete_notes(name) {
  if (name !== default_name) {
    storage.del(name); //always remove
  }
  store.emit('DOCUMENT-DELETE', {});
}

function rename_notes(src, target) {
  if (src === target) return;
  duplicate_notes(src, target);
  delete_notes(src);
  store.emit('DOCUMENT-RENAME', {});
}

function get_all_notes_name() {
  let r = {};
  for (let k of storage.keys()) {
    r[k] = 'Notes';
  }
  return r;
}

function is_notes(name) {
  return storage.get(name) !== null;
}

//in a dict
/* each notes is one string. same as the b64 version without base64 encode.
notes_name1: stringify({
   doc_name1: markdown body with frontmatter, same as shown in editor
   doc_name2: ...
})
notes_name2: stringify({
   doc_name1: ...
})

*/
function get_all_notes() {
  let d = {};
  for (let n of Object.keys(get_all_notes_name())) {
    d[n] = get_doc(n);
  }
  return d;
}

//get_doc_obj

function get_all_notes_obj() {
  let d = {};
  for (let n of Object.keys(get_all_notes_name())) {
    d[n] = get_doc_obj(n);
  }
  return d;
}

/*
function build_doc() {
  //generate string data
  var obj = {};
  var documents = get_documents();
  for (const el in documents) {
    if (documents.hasOwnProperty(el)) {
      obj[el] = get_document_content(el);  //the string with node body markdown and frontmatter
    }
  }
  var obj_str = JSON.stringify(obj);
  return obj_str;
}
*/

function append_document(name, text, notesname) {
  if ((!notesname)  || notesname === notes_name) {
    let t = get_document_content(name);
    t += text;
    update_document(name, t);
  } else {
    //it's not current active notes, update storage directly.
    let docs = storage.get(notesname);
    if (docs) {
      docs = JSON.parse(docs);
      docs[name] += text;
      update_storage(notesname, JSON.stringify(docs));
    }
  }

}

function set_all_notes(data) {
  for (let n of Object.keys(get_all_notes_name())) {
    storage.del(n); //always remove
  }
  for (let n of Object.keys(data)) {
    update_storage(n, data[n]);
  }
  notes_name = default_name;
  reset(notes_name);
}

exports.reset = reset;
exports.get_b64 = get_b64;

exports.get_active_document = get_active_document;
exports.set_active_document = set_active_document;
exports.get_impacted_document = get_impacted_document;

exports.get_documents = get_documents;
exports.update_document = update_document;   //new doc & modify doc
exports.get_document_content = get_document_content;
exports.get_document_body = get_document_body;
exports.rename_document = rename_document;
exports.delete_document = delete_document;
exports.document_available = document_available;

exports.get_subnode_names = get_subnode_names;
exports.get_edges = get_edges;

exports.get_attr = get_attr;
exports.update_attr = update_attr;
exports.get_attrs = get_attrs;
exports.get_common_attr = get_common_attr;

exports.get_all_names = get_all_names;
exports.on = store.on;
exports.reset_listener = store.reset_listener;
exports.set_config = set_config;
exports.get_config = get_config;

exports.format = format;

exports.get_doc = get_doc;

exports.is_notes = is_notes;
exports.new_notes = new_notes;
exports.delete_notes = delete_notes;
exports.rename_notes = rename_notes;
exports.duplicate_notes = duplicate_notes;
exports.get_notes_name = get_notes_name;
exports.get_all_notes_name = get_all_notes_name;
exports.get_all_notes = get_all_notes;  //in a dict
exports.set_all_notes = set_all_notes;  //in a dict
exports.get_all_notes_obj = get_all_notes_obj;

exports.get_outline = get_outline;
exports.append_document = append_document;

/*
notes_name1:
   doc_name1: ...
   doc_name2: ...
notes_name2:
   doc_name1: ...
   doc_name2: ...

*/

/* support EVENTS
'ACTIVE-DOCUMENT'
'DOCUMENT-UPDATE'
"DOCUMENT-DELETE"
"DOCUMENT-RENAME"
‘RESET’
‘OPEN-NOTES’
STORAGE_UPDATE
*****************/
