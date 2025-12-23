# Jamboree Hub MVP - Demo Presentation Guide

## Pre-Meeting Setup (5 minutes before)

- [ ] Start the dev server: `npm run dev`
- [ ] Open browser to `http://localhost:3000`
- [ ] Have 3 browser windows ready (or use incognito tabs):
  - Window 1: Adult leader (Kyle Haines)
  - Window 2: Youth Scout (Liam H.)
  - Window 3: Parent (Parent of Liam)
- [ ] Connect to projector/screen share
- [ ] Have the FEEDBACK.md printed or ready to share

## Opening (2 minutes)

**The Problem:**
"At Jamboree, we'll have 100+ Scouts and adults spread across a huge venue. We need a way to:
- Coordinate activities across multiple units
- Keep families informed
- Make announcements quickly
- Maintain YPT compliance
- Handle the chaos of a major event"

**The Solution:**
"I've built a prototype of a web-based communication hub that addresses these needs while enforcing Youth Protection policies digitally."

## Demo Flow (15-20 minutes)

### Part 1: The Concept (2 minutes)
"This is a Progressive Web App - it installs on any device like a regular app, works on phones and tablets, and will work offline when WiFi is spotty."

**Key Points:**
- No app store approval delays
- Works on iOS, Android, everything
- Updates instantly for everyone
- Can be built and deployed before Jamboree

### Part 2: Adult Leader View (5 minutes)

**Login as Kyle Haines (Adult - Crew 22)**

**Show:**
1. **Channel sidebar:** "Notice I can see multiple channel types"
   - Contingent Announcements (everyone)
   - My unit (Crew 22)
   - Leadership channels (adults only)
   - Family updates

2. **Post privileges:** "As an adult, I can post in most channels"
   - Try typing a message (show the input field)
   - Explain: "Messages would actually send in production"

3. **Pinned messages:** "Important announcements can be pinned to the top"
   - Point out the 📌 icons

4. **Schedule view:** Switch to schedule tab
   - Daily schedule with times
   - Weather forecast
   - Emergency contacts
   - Key locations

**Talking Points:**
- "This is the full-access view leaders need"
- "Two-deep leadership is enforced - see the moderator list"
- "We can coordinate across units easily"

### Part 3: Youth Scout View (5 minutes)

**Login as Liam H. (Youth - Crew 22)**

**Show:**
1. **Limited channel access:** "Notice what Liam CAN'T see"
   - No leadership channels
   - No other unit channels
   - Only public announcements and his own unit

2. **Can post in his unit:** "Youth can communicate within their unit"
   - Two adult moderators are always watching
   - No private messaging possible

3. **Same schedule access:** "Everyone sees the same daily schedule"

**Talking Points:**
- "Youth Protection is enforced by the system"
- "Scouts can't accidentally message adults privately"
- "They stay connected to their unit but not overwhelmed"

### Part 4: Parent View (3 minutes)

**Login as Parent of Liam (Parent - Crew 22)**

**Show:**
1. **Read-only access:** "Parents can see but not post"
   - Contingent announcements
   - Their Scout's unit channel
   - Family updates channel

2. **No posting capability:** "Notice there's no message input box"
   - Prevents confusion about communication
   - Parents stay informed but don't interrupt

**Talking Points:**
- "Families get updates without being in the way"
- "They can see what their Scout's unit is up to"
- "Read-only prevents communication confusion"

### Part 5: YPT Compliance Deep Dive (3 minutes)

**Back to adult view - point out:**

1. **Two-Deep Leadership**
   - Show moderator list on unit channels
   - "Every youth-accessible channel requires 2 adult moderators"

2. **No Private Messaging**
   - "There's no DM feature at all"
   - "All communication happens in supervised spaces"

3. **Audit Trail**
   - "In production, all messages would be logged"
   - "Complete transparency for safety"

4. **Age-Gated Channels**
   - "System enforces who can access what"
   - "No way for youth to access adult channels"

**Ask the group:**
"Do you see any YPT gaps I'm missing?"

## Q&A Session (10-15 minutes)

### Expected Questions & Answers

**Q: "What if WiFi goes down?"**
A: "The production version would cache everything. You'd still be able to read messages and view the schedule. New messages would queue and send when connection returns."

**Q: "How do we get everyone onboarded?"**
A: "Several options: pre-Jamboree training, email instructions, help desk at check-in. I'd suggest unit leaders train their Scouts before leaving."

**Q: "What about Scouts without phones?"**
A: "We could have shared tablets at the campsite, or use the buddy system where Scouts share access."

**Q: "Can we test this before Jamboree?"**
A: "Absolutely! We can deploy it now and use it for planning. Get comfortable with it before the event."

**Q: "What about photos?"**
A: "Not in this MVP, but easy to add. We'd need YPT guidelines for photo sharing - maybe leaders-only posting with family viewing."

**Q: "How much will this cost?"**
A: "Initial deployment: free using Fly.io's free tier. At scale with 100+ users, maybe $20-30/month. Much cheaper than alternatives."

**Q: "Why not just use [GroupMe/WhatsApp/etc]?"**
A: "Those don't have YPT compliance built in. Private messaging is allowed, no two-deep leadership enforcement, no role-based access control."

### Handling Concerns

**If they're skeptical:**
- "This is just a demo. We can modify anything."
- "What would make this work for you?"
- "What problems do you see?"

**If they're enthusiastic:**
- "What features should we prioritize?"
- "Who wants to help test the next version?"
- "What's our timeline for deployment?"

## Closing (5 minutes)

### Next Steps:
1. "I need your feedback - here's a feedback form"
   - Hand out or share FEEDBACK.md
   - "Be honest - what works, what doesn't"

2. "If we move forward, here's the plan:"
   - Week 1: Gather feedback, revise MVP
   - Week 2: Set up real backend (Zulip + database)
   - Week 3: Beta testing with leadership team
   - Week 4: Deploy for all units to test
   - Pre-Jamboree: Training sessions
   - At Jamboree: Help desk for support

3. "Decision timeline:"
   - "Let's decide by [DATE] if we're doing this"
   - "That gives us [X weeks] to build and test"

### Call to Action:
"Who's interested in helping develop this further?"
- Look for volunteers for:
  - Testing
  - Feature feedback
  - Training development
  - Jamboree support team

## After the Meeting

**Follow-up:**
- [ ] Email demo link (if deployed) to all attendees
- [ ] Share feedback form digitally
- [ ] Set deadline for feedback
- [ ] Schedule follow-up meeting to review feedback
- [ ] Document all questions and concerns raised

**Development priorities based on feedback:**
1. Fix any critical concerns
2. Add must-have features
3. Test with small group
4. Iterate based on real usage

---

## Backup Plans

**If tech fails:**
- Have screenshots ready
- Walk through mockups on paper
- Focus on concept discussion

**If running long:**
- Skip parent view (less critical)
- Shorten Q&A (collect written questions)

**If running short:**
- Deeper dive on technical architecture
- Discussion of future features
- Brainstorm additional use cases

## Success Metrics

You'll know the demo was successful if:
- [ ] Leaders understand the YPT compliance model
- [ ] At least 2-3 people volunteer to help test
- [ ] You get specific, actionable feedback
- [ ] The group makes a go/no-go decision timeline
- [ ] People are talking about it after the meeting

Good luck! 🏕️
