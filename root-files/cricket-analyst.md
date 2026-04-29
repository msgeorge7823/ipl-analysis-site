# The Complete Cricket Analyst Playbook: A-Z Guide

## Table of Contents

1. [Foundations of Cricket Analytics](#1-foundations-of-cricket-analytics)
2. [Data Sources and Collection](#2-data-sources-and-collection)
3. [Key Performance Metrics — Batting](#3-key-performance-metrics--batting)
4. [Key Performance Metrics — Bowling](#4-key-performance-metrics--bowling)
5. [Key Performance Metrics — Fielding & Wicketkeeping](#5-key-performance-metrics--fielding--wicketkeeping)
6. [Key Performance Metrics — All-Rounders](#6-key-performance-metrics--all-rounders)
7. [Advanced Analytics & Mathematical Models](#7-advanced-analytics--mathematical-models)
8. [Phase-Wise Analysis (T20/IPL Specific)](#8-phase-wise-analysis-t20ipl-specific)
9. [Match Situation Analysis](#9-match-situation-analysis)
10. [Team Composition & Balance Analysis](#10-team-composition--balance-analysis)
11. [SWOT Analysis Framework for IPL Teams](#11-swot-analysis-framework-for-ipl-teams)
12. [Auction Strategy & Player Valuation](#12-auction-strategy--player-valuation)
13. [Opposition & Matchup Analysis](#13-opposition--matchup-analysis)
14. [Conditions & Venue Analysis](#14-conditions--venue-analysis)
15. [Scouting from Domestic & International Leagues](#15-scouting-from-domestic--international-leagues)
16. [Building Dashboards & Reports](#16-building-dashboards--reports)
17. [Tools & Technology Stack](#17-tools--technology-stack)
18. [Presenting to Team Management](#18-presenting-to-team-management)
19. [Case Studies & Practical Examples](#19-case-studies--practical-examples)
20. [Glossary of Terms](#20-glossary-of-terms)

---

## 1. Foundations of Cricket Analytics

### 1.1 What Does a Cricket Analyst Do?

A cricket analyst converts raw match data into actionable intelligence. The role spans:

- **Pre-match**: Opposition profiling, pitch/weather assessment, optimal XI selection
- **In-match**: Real-time data feeds, tactical suggestions, DLS calculations, field placement advice
- **Post-match**: Performance review, trend identification, areas of improvement
- **Auction/Recruitment**: Player valuation, squad gap analysis, shortlisting, auction modelling

### 1.2 The Three Pillars of Cricket Analysis

| Pillar | Description |
|--------|-------------|
| **Descriptive** | What happened? (Stats, scorecards, wagon wheels) |
| **Diagnostic** | Why did it happen? (Matchups, conditions, phase-wise breakdowns) |
| **Predictive** | What will happen? (Models, projections, simulations) |

### 1.3 Formats and Their Analytical Differences

| Aspect | T20 | ODI | Test |
|--------|-----|-----|------|
| Primary currency | Strike rate, boundary % | Balance of SR and average | Average, patience, resilience |
| Bowling priority | Economy, dot ball % | Wickets in middle overs | Wickets, control % |
| Key phase | Powerplay + death | Middle overs | Sessions, new ball spells |
| Fitness emphasis | Explosive, fielding | Endurance + explosiveness | Endurance, concentration |

---

## 2. Data Sources and Collection

### 2.1 Public Data Sources

| Source | What It Offers | URL/Access |
|--------|---------------|------------|
| ESPNcricinfo | Ball-by-ball commentary, scorecards, player profiles | espncricinfo.com |
| Cricsheet | Free ball-by-ball data in CSV/JSON/YAML | cricsheet.org |
| HowStat | Historical stats, head-to-head records | howstat.com |
| CricketArchive | Domestic cricket records globally | cricketarchive.com |
| ICC Rankings | Official player/team rankings | icc-cricket.com |
| IPL Official | Season-wise stats, auction data | iplt20.com |
| Cricbuzz | Live data, news, analysis | cricbuzz.com |

### 2.2 Premium / Professional Data Sources

| Source | What It Offers |
|--------|---------------|
| **CricViz** | Advanced metrics, ball-tracking, Expected Wickets, match predictions |
| **Hawk-Eye** | Ball-tracking technology, pitch maps, wagon wheels |
| **WASP (Winning And Score Predictor)** | Real-time win probability models |
| **PitchVision** | Video analysis + sensor data for player development |
| **Opta / Stats Perform** | Granular event-level data feeds |

### 2.3 Building Your Own Database

Structure your database around these core tables:

```
matches (match_id, date, venue, format, teams, toss, result, conditions)
innings (innings_id, match_id, batting_team, total, wickets, overs)
deliveries (delivery_id, innings_id, over, ball, batter, bowler, runs, extras, wicket_type, fielder)
players (player_id, name, nationality, batting_style, bowling_style, role, dob)
venues (venue_id, name, city, country, pitch_type, avg_first_innings_score, avg_second_innings_score)
```

---

## 3. Key Performance Metrics — Batting

### 3.1 Traditional Metrics

| Metric | Formula | Use Case |
|--------|---------|----------|
| **Batting Average** | Total Runs / Dismissals | Consistency indicator |
| **Strike Rate (SR)** | (Runs / Balls Faced) x 100 | Scoring speed |
| **50s / 100s Count** | Milestones reached | Big-score ability |
| **Highest Score** | Max innings score | Ceiling performance |
| **Not Out %** | Not Outs / Innings | Finishing ability indicator |

### 3.2 Advanced Batting Metrics

| Metric | Formula / Description | Why It Matters |
|--------|----------------------|----------------|
| **Boundary Percentage** | (4s + 6s) x Boundary Runs / Total Runs x 100 | Shows how a batter scores — rotation vs. boundaries |
| **Dot Ball %** | Dot Balls / Balls Faced x 100 | Pressure absorption — lower is better in T20 |
| **Balls Per Boundary** | Balls Faced / (4s + 6s) | Boundary-hitting frequency |
| **Average Balls Faced** | Total Balls Faced / Innings | Tells you about role (anchor vs. hitter) |
| **Runs Per Innings (RPI)** | Total Runs / Innings Played | Better than average when not-outs distort |
| **False Shot %** | Balls Mis-hit or Missed / Total Balls | Measures control (from ball-tracking data) |
| **Expected Average** | Uses edge %, false shot data to predict true average | Separates luck from skill |
| **Intent Rate** | Attacking Shots / Total Shots Played | Measures aggression approach |

### 3.3 Phase-Wise Batting Splits (T20)

Break every batter's numbers into:

| Phase | Overs | What to Measure |
|-------|-------|-----------------|
| **Powerplay** | 1-6 | SR, Avg, Boundary %, Dot % |
| **Middle Overs** | 7-15 | SR, Avg, Rotation %, Risk shots |
| **Death Overs** | 16-20 | SR, Avg, Boundary %, Finishing rate |

### 3.4 Situational Batting Splits

Always analyse batting performance under these conditions:

- **Batting Position**: 1-3 (top), 4-5 (middle), 6-7 (lower), 8+ (tail)
- **Chasing vs. Setting**: Some batters are better chasers
- **Under Pressure**: When 3+ wickets have fallen cheaply
- **Against Pace vs. Spin**: Breakdown by bowler type
- **Left-arm vs. Right-arm**: Handedness matchup
- **Venue/Conditions**: Home vs. Away, Batting-friendly vs. Bowling-friendly
- **First 10 Balls**: How quickly they settle (SR in first 10 balls)
- **After 20 Balls**: Acceleration ability (SR after settling)

### 3.5 Impact Scoring (Custom Formula)

```
Batting Impact Score = 
    (Runs Scored x 1.0) 
  + (Boundaries x 1.5) 
  + (Sixes x 2.5) 
  - (Dot Balls x 0.5) 
  + (Runs scored in death overs x 1.2 multiplier) 
  + (Runs scored while chasing in last 5 overs x 1.5 multiplier)
  - (Ducks x 5)
```

Weight these multipliers based on match context and format.

---

## 4. Key Performance Metrics — Bowling

### 4.1 Traditional Metrics

| Metric | Formula | Use Case |
|--------|---------|----------|
| **Bowling Average** | Runs Conceded / Wickets Taken | Cost per wicket |
| **Economy Rate** | Runs Conceded / Overs Bowled | Run containment |
| **Strike Rate** | Balls Bowled / Wickets Taken | Wicket-taking frequency |
| **4W / 5W Hauls** | Count of 4+ or 5+ wicket innings | Match-winning ability |

### 4.2 Advanced Bowling Metrics

| Metric | Formula / Description | Why It Matters |
|--------|----------------------|----------------|
| **Dot Ball %** | Dot Balls / Total Balls Bowled x 100 | Pressure building — the single most important T20 bowling stat |
| **Boundary %** | Boundaries Conceded / Balls Bowled x 100 | Damage limitation |
| **Death Overs Economy** | Runs conceded in overs 16-20 / Overs bowled | Specialist death bowling ability |
| **Powerplay Economy** | Runs conceded in overs 1-6 / Overs bowled | New ball effectiveness |
| **Expected Wickets (xW)** | Probability-based model using ball speed, length, line | Separates luck from skill — did the bowler deserve more/fewer wickets? |
| **Balls Per Boundary** | Total Balls / Boundaries Conceded | Boundary prevention |
| **Wickets in Winning Cause** | Wickets taken when team won | Clutch performance |
| **Extras Conceded** | Wides + No Balls | Discipline and control |
| **Runs Per Wicket (RPW)** | Total Runs Conceded / Total Wickets | Efficiency metric |
| **Control %** | Balls hitting intended zone / Total balls | From ball-tracking — measures execution |

### 4.3 Bowling Variations Analysis

Track effectiveness of each delivery type:

| Variation | Metrics to Track |
|-----------|-----------------|
| Yorker | % executed, runs conceded, wickets |
| Bouncer | Dot %, wickets, runs off pull/hook |
| Slower Ball | Deception rate, wickets, economy |
| Wide Yorker | Dot %, boundary conceded % |
| Leg Cutter / Off Cutter | Movement, edge %, wickets |
| Googly / Doosra | Deception %, dot %, wickets |
| Carrom Ball | Wickets, economy in middle overs |
| Knuckleball | Effectiveness at death, dot % |

### 4.4 Phase-Wise Bowling Splits (T20)

| Phase | Key Metrics |
|-------|-------------|
| **Powerplay (1-6)** | Wickets, Economy, Dot %, Swing/Seam movement |
| **Middle (7-15)** | Economy, Dot %, Boundary %, Spin effectiveness |
| **Death (16-20)** | Economy, Dot %, Yorker %, Boundary %, Wide % |

### 4.5 Bowling Impact Score (Custom Formula)

```
Bowling Impact Score = 
    (Wickets x 25) 
  + (Dot Balls x 2) 
  + (Maidens x 15) 
  - (Boundaries Conceded x 3) 
  - (Sixes Conceded x 5) 
  - (Extras x 4) 
  + (Death Over Wickets x 1.5 multiplier) 
  + (Powerplay Wickets x 1.3 multiplier)
```

---

## 5. Key Performance Metrics — Fielding & Wicketkeeping

### 5.1 Fielding Metrics

| Metric | Description |
|--------|-------------|
| **Catches Taken** | Total catches (separate: outfield, close-in, boundary) |
| **Catch Success %** | Catches Taken / (Catches Taken + Drops) |
| **Run Outs (Direct Hits)** | Direct hit run outs — the premium fielding stat |
| **Run Outs (Assists)** | Involved in run out but not the direct hitter |
| **Saves** | Runs saved in the field through diving stops, slides |
| **Ground Fielding Efficiency** | Balls fielded cleanly / Total fielding opportunities |
| **Throwing Accuracy** | Accurate throws at stumps / Total throws |
| **Catches Under Pressure** | Catches in death overs or match-critical moments |
| **Fielding Position Versatility** | Number of positions fielded effectively |

### 5.2 Wicketkeeping Metrics

| Metric | Description |
|--------|-------------|
| **Dismissals Per Innings** | (Catches + Stumpings) / Innings |
| **Stumping Conversion Rate** | Successful Stumpings / Stumping Opportunities |
| **Byes Per Match** | Byes conceded / Matches |
| **Standing Up Success Rate** | Clean takes when standing up to medium pace |

### 5.3 Fielding Value Model

```
Fielding Value = 
    (Catches x 10) 
  + (Direct Hit Run Outs x 15) 
  + (Run Out Assists x 7) 
  + (Boundary Saves x 5) 
  - (Drops x 12) 
  - (Misfields x 3)
```

---

## 6. Key Performance Metrics — All-Rounders

### 6.1 The All-Rounder Problem

All-rounders are the hardest to evaluate because you must combine two different skill sets. Simple averages don't capture their dual value.

### 6.2 All-Rounder Metrics

| Metric | Formula | Description |
|--------|---------|-------------|
| **All-Rounder Index (ARI)** | Batting Avg x Batting SR / (Bowling Avg x Bowling SR) x 1000 | Higher = better. Combines both disciplines |
| **Player Value Index** | (Batting Impact + Bowling Impact + Fielding Value) / Matches | Composite match contribution |
| **MVP Index** | Weighted sum of runs, wickets, catches, run outs, economy bonus | Used by IPL officially |
| **Batting Contribution %** | Runs / Team Total x 100 (averaged across matches) | How much batting load they carry |
| **Bowling Contribution %** | Overs bowled / Total overs x 100 | How much bowling load they carry |
| **Match-Winning Contributions** | Matches where player was top 2 performer in winning cause | Clutch value |

### 6.3 Classifying All-Rounders

| Type | Profile | Example Archetype |
|------|---------|-------------------|
| **Batting All-Rounder** | Bats in top 5, bowls 1-2 overs | Bats avg 35+, bowls 2+ overs regularly |
| **Bowling All-Rounder** | Primary bowler who bats at 7-8 | Bowls 4 overs, scores useful 15-20 |
| **Genuine All-Rounder** | Top 5 bat + 4-over bowler | Elite category — rarest and most valuable |
| **Bits-and-Pieces** | Neither discipline is reliable | Risk in T20 squads — limited ceiling |

---

## 7. Advanced Analytics & Mathematical Models

### 7.1 Expected Runs (xR) Model

Calculates expected runs for each delivery based on:
- Ball speed
- Length (full, good, short)
- Line (off, middle, leg, wide)
- Phase of innings
- Batter's historical data vs. similar deliveries

```
xR = Σ P(outcome_i) x runs(outcome_i)
where outcomes = {dot, 1, 2, 3, 4, 6, wicket}
```

If a batter scores more than xR consistently, they are performing above expectation.

### 7.2 Expected Wickets (xW) Model

For each delivery, calculate the probability of a wicket based on:
- Delivery attributes (speed, length, line, movement)
- Batter profile (weakness zones)
- Match situation (phase, required rate)

```
xW = Σ P(wicket | delivery_attributes)
```

If a bowler has more actual wickets than xW, they may be getting lucky (or finishing batters off). Fewer wickets than xW suggests bad luck or poor catching.

### 7.3 Win Probability Model

At any point in a match, calculate:

```
Win_Probability = f(runs_scored, wickets_lost, overs_remaining, 
                     required_run_rate, batting_team_strength, 
                     pitch_conditions, historical_chase_data)
```

Methods:
- **Logistic Regression**: Train on historical ball-by-ball data
- **Random Forest / XGBoost**: Feature-rich models with better accuracy
- **Bayesian Updating**: Update probability ball-by-ball

### 7.4 Player Rating Systems

#### 7.4.1 ELO-Style Rating for Batters and Bowlers

```
New_Rating = Old_Rating + K x (Actual_Performance - Expected_Performance)
```

- K-factor adjusts for match importance (final > league match)
- Expected performance based on opposition quality
- Separate ratings for each format

#### 7.4.2 Bayesian Averaging

Problem: A player with 3 innings of SR 200 is not necessarily better than one with 50 innings of SR 145.

```
Bayesian_SR = (n x Player_SR + m x League_Avg_SR) / (n + m)
where n = player's sample size, m = regression constant (typically 10-20 innings)
```

This regresses small samples toward the mean, preventing overvaluation of small samples.

### 7.5 Clustering Analysis

Use K-means or hierarchical clustering to group players into archetypes:

**Batting Clusters (T20):**
- Anchor (High Avg, Moderate SR, Low Boundary %)
- Power Hitter (High SR, High Boundary %, Lower Avg)
- Accumulator-Accelerator (Moderate start SR, High finish SR)
- Floater (Versatile across phases)

**Bowling Clusters (T20):**
- Powerplay Specialist (Low economy in PP, high wickets)
- Death Specialist (Low economy 16-20, yorker %)
- Spin Controller (High dot %, low boundary %, middle overs)
- Wicket-Taker (High wickets, higher economy trade-off)

### 7.6 Regression Analysis

Use linear/logistic regression to find which variables most predict match outcomes:

```python
# Example: What predicts T20 wins?
# Dependent variable: Win (1/0)
# Independent variables:
features = [
    'powerplay_score',
    'dot_ball_percentage',
    'boundary_percentage',
    'death_overs_economy',
    'extras_conceded',
    'fielding_efficiency',
    'run_rate_in_middle_overs',
    'wickets_in_powerplay'
]
```

Typical findings in T20:
- Death bowling economy is the #1 predictor of team success
- Powerplay wickets are more valuable than powerplay runs
- Dot ball % in middle overs strongly correlates with lower totals

### 7.7 Monte Carlo Simulation

For auction strategy and squad building:

```
For each possible squad combination:
    Simulate 1000 seasons
    In each simulation:
        Randomly assign match outcomes based on player ratings
        Account for injuries (probability models)
        Calculate playoff probability
    
    Squad_Value = Average(Playoff_Probability across simulations)
```

### 7.8 WAR (Wins Above Replacement)

Adapted from baseball:

```
WAR = (Player's Contribution - Replacement-Level Contribution) / Runs_Per_Win

Where:
Batting WAR = (Player Runs - Replacement Runs) / RPW
Bowling WAR = (Replacement Runs Conceded - Player Runs Conceded) / RPW
Fielding WAR = (Runs Saved Above Average) / RPW
Total WAR = Batting WAR + Bowling WAR + Fielding WAR
```

Replacement level = what a freely available (uncapped, bench) player would contribute.

---

## 8. Phase-Wise Analysis (T20/IPL Specific)

### 8.1 Powerplay (Overs 1-6)

**Batting KPIs:**
- Score: Target 50+ in IPL conditions
- Wickets lost: 0-1 is ideal
- Boundary %: 60%+ of runs from boundaries
- SR: 130+ is competitive

**Bowling KPIs:**
- Wickets: 1-2 in PP is excellent
- Economy: < 7.5 is good
- Dot %: 40%+ is elite
- New ball swing/seam data

### 8.2 Middle Overs (Overs 7-15)

**Batting KPIs:**
- SR: 125-140 is competitive
- Wickets lost: Preserve for death
- Rotation: Singles and doubles rate
- Boundary hitting against spin

**Bowling KPIs:**
- Economy: < 7.0 is excellent
- Dot %: 45%+ is elite
- Spin effectiveness: Avg and SR
- Boundary %: < 10% is strong

### 8.3 Death Overs (Overs 16-20)

**Batting KPIs:**
- SR: 160+ is competitive
- Runs in last 5: 55+ is good
- Boundary %: 70%+ of runs
- Finishing: Ability to stay not out

**Bowling KPIs:**
- Economy: < 9.0 is very good (< 8.0 is elite)
- Yorker %: Percentage of deliveries that are yorkers
- Wide %: < 5% is disciplined
- Boundary %: < 20% is strong
- Dot %: 30%+ at death is elite

### 8.4 Phase Impact Matrix

Create a matrix for each player:

```
Player: [Name]
Format: T20

              PP (1-6)    Middle (7-15)    Death (16-20)
Avg           35.2        28.4             18.7
SR            142.3       128.5            175.2
Boundary %    62%         45%              72%
Dot %         28%         35%              22%
Dismissal %   15%         35%              50%
Role Fit      Opener      Anchor           Finisher
Rating        A           B+               A+
```

---

## 9. Match Situation Analysis

### 9.1 Pressure Index

Quantify the pressure on a batter at any point:

```
Pressure_Index = 
    (Required_Run_Rate / Current_Run_Rate) x 
    (Wickets_Lost / 10) x 
    Phase_Multiplier x 
    Chase_Multiplier

Where:
    Phase_Multiplier = 1.0 (PP), 1.2 (Middle), 1.5 (Death)
    Chase_Multiplier = 1.0 (Setting), 1.3 (Chasing)
```

Then measure player performance at different Pressure Index levels.

### 9.2 Win Contribution Index

For each player's innings, calculate:

```
Win_Contribution = 
    Change in Win Probability from start of innings to end of innings
```

Sum across matches to get cumulative Win Contribution.

### 9.3 Clutch Performance Rating

```
Clutch_Rating = 
    Performance in High Pressure (PI > 1.5) / 
    Performance in Low Pressure (PI < 0.8)

If Clutch_Rating > 1.0 → Player elevates under pressure
If Clutch_Rating < 1.0 → Player struggles under pressure
```

### 9.4 Context-Adjusted Metrics

Every raw stat should have a context-adjusted version:

```
Context_Adjusted_SR = Raw_SR x (League_Avg_SR_in_similar_context / League_Avg_SR)
```

Context factors:
- Phase of innings
- Match situation (chasing/setting)
- Pitch conditions (batting-friendly to bowling-friendly, scale 1-5)
- Opposition bowling quality (ranked by season bowling rating)

---

## 10. Team Composition & Balance Analysis

### 10.1 Ideal T20/IPL Squad Structure

**Playing XI Blueprint:**

| Slot | Role | Key Requirement |
|------|------|-----------------|
| 1 | Aggressive Opener | High PP SR, boundary % |
| 2 | Anchor Opener | High Avg, ability to accelerate |
| 3 | No. 3 Batter | Versatile — can anchor or accelerate |
| 4 | Middle-Order Batter | High SR vs. spin, finisher capability |
| 5 | Batting All-Rounder | Bats 5, bowls 1-2 overs |
| 6 | Wicketkeeper-Batter | Dual value — keeping + batting |
| 7 | Bowling All-Rounder | Genuine 4-over bowler + useful 20 runs |
| 8 | Specialist Spinner | Middle-overs controller |
| 9 | Fast Bowler (PP Specialist) | Swing, pace, PP wickets |
| 10 | Fast Bowler (Versatile) | Can bowl PP and death |
| 11 | Fast Bowler (Death Specialist) | Yorkers, slower balls, death economy |

### 10.2 Squad Balance Checks

| Check | Ideal | Why |
|-------|-------|-----|
| Overseas slots | 4 in XI, 8 in squad | IPL rule — maximize quality |
| Batting depth | 7 batters who can score 20+ | Avoid tail exposure |
| Bowling options | 6+ bowling options in XI | Tactical flexibility |
| Left-right combination | Mix in top 4 | Disrupts bowler lines |
| Spin-pace ratio | 2 spinners + 3 pacers (adjust for venue) | Standard for Indian conditions |
| Death bowling options | 2-3 reliable death bowlers | Most important T20 skill |
| Powerplay bowling | 2 swing/seam bowlers | Early wickets |
| Captaincy | Experienced leader | Tactical and man-management |

### 10.3 Overs Allocation Analysis

Map out where your 20 overs of bowling come from:

```
Example:
Pacer A:    4 overs (PP specialist)     → PP: 3, Middle: 1
Pacer B:    4 overs (death specialist)  → Middle: 1, Death: 3
Pacer C:    4 overs (versatile)         → PP: 2, Death: 2
Spinner A:  4 overs (controller)        → Middle: 4
Spinner B:  2 overs (part-time)         → Middle: 2
All-Rounder: 2 overs (middle overs)     → Middle: 2
                                         Total: 20 overs
```

Ensure every phase has adequate coverage.

### 10.4 Batting Order Optimisation

Use historical data to find optimal batting positions:

```
For each player, calculate Performance Index at each position:
PI(position) = (Avg at position x SR at position) / 100

Optimal XI batting order = Maximize Σ PI(player, assigned_position)
subject to: each position assigned exactly one player
```

This is an assignment problem — solvable with the Hungarian Algorithm.

---

## 11. SWOT Analysis Framework for IPL Teams

### 11.1 How to Conduct Team SWOT Analysis

For each IPL team, systematically evaluate:

#### STRENGTHS

Analyse:
- **Top Performers**: Players with above-average metrics in key stats
- **Phase Dominance**: Phases where the team statistically outperforms (e.g., best death bowling in IPL)
- **Home Record**: Win % at home venues
- **Depth**: Backup quality for each role
- **Matchups**: Specific opposition teams/players they dominate
- **Consistency**: Low variance in performance across the season
- **Experience**: Number of international caps, IPL seasons, finals played

Questions to ask:
1. Which phases do we dominate in batting and bowling?
2. Who are our bankable match-winners?
3. What is our home ground advantage?
4. Where is our squad depth strongest?

#### WEAKNESSES

Analyse:
- **Statistical Underperformance**: Players/phases with below-average metrics
- **Dependency**: Over-reliance on 1-2 players (if top 2 fail, does team collapse?)
- **Phase Vulnerability**: Phases where team concedes most/scores least
- **Overseas Imbalance**: If your best 5 overseas players exceed 4 slots
- **Left-Arm Gap**: No left-arm pace/spin option for variety
- **Death Bowling**: Identify if death economy > 10 (critical weakness)
- **Middle-Over Scoring**: SR dip in overs 7-15

Questions to ask:
1. Where do we leak runs or lose wickets disproportionately?
2. What happens when Player X is injured/out of form?
3. Which matchups do we consistently lose?
4. What is our worst phase and why?

#### OPPORTUNITIES

Analyse:
- **Auction Pool**: Identify players available who directly address weaknesses
- **Emerging Talent**: Uncapped/domestic players with strong recent form
- **Rule Changes**: New rules (e.g., Impact Player) and how to exploit them
- **Opposition Weakness**: Specific vulnerabilities in rival squads
- **Schedule Advantage**: Venue sequence, travel, rest days
- **Development**: Young players who could break through with coaching

Questions to ask:
1. Which available players solve our biggest weakness?
2. What rule changes can we exploit better than opponents?
3. Which domestic players are ready for IPL?
4. Can we develop existing squad members into new roles?

#### THREATS

Analyse:
- **Auction Inflation**: Key targets may be overpriced
- **Injury Risk**: Players with injury history in key roles
- **Form Slumps**: Players due for regression (xStats vs. actual)
- **Rival Strengthening**: How other teams might fill their gaps
- **Scheduling**: Fixture congestion, travel fatigue
- **Pitch Changes**: Venue pitch behaviour shifting (e.g., drop-in pitches)

Questions to ask:
1. Who might get injured during the tournament?
2. Which players are performing above expected levels (regression risk)?
3. How are our main rivals strengthening?
4. What external factors could hurt us?

### 11.2 SWOT-to-Action Matrix

| SWOT Finding | Priority | Action | Timeline |
|-------------|----------|--------|----------|
| Weak death bowling | Critical | Target 2 death bowlers in auction | Pre-auction |
| Over-reliance on Player X | High | Develop backup, sign similar profile | Pre-season |
| Strong spin attack | Medium | Schedule practice on turning tracks | In-season |
| Rival signed our target | High | Pivot to alternative shortlist | Auction day |

### 11.3 Gap Analysis Template

```
TEAM: [Team Name]
SEASON: [Year]

ROLE GAP ANALYSIS:
┌─────────────────────┬──────────────────┬──────────────┬───────────────┐
│ Role                │ Current Player   │ Rating (1-10)│ Gap (Y/N)     │
├─────────────────────┼──────────────────┼──────────────┼───────────────┤
│ PP Opener (Aggr.)   │                  │              │               │
│ Anchor Opener       │                  │              │               │
│ No. 3               │                  │              │               │
│ Middle Order        │                  │              │               │
│ Finisher            │                  │              │               │
│ WK-Batter           │                  │              │               │
│ Batting AR          │                  │              │               │
│ Bowling AR          │                  │              │               │
│ Spinner (Control)   │                  │              │               │
│ Spinner (Wicket)    │                  │              │               │
│ Pacer (PP)          │                  │              │               │
│ Pacer (Death)       │                  │              │               │
│ Pacer (Versatile)   │                  │              │               │
│ Captain             │                  │              │               │
└─────────────────────┴──────────────────┴──────────────┴───────────────┘

PHASE GAP ANALYSIS:
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Phase        │ Batting Rank │ Bowling Rank │ Gap Severity │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Powerplay    │   /10 teams  │   /10 teams  │              │
│ Middle Overs │   /10 teams  │   /10 teams  │              │
│ Death Overs  │   /10 teams  │   /10 teams  │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 12. Auction Strategy & Player Valuation

### 12.1 Player Valuation Model

Assign a monetary value to each player based on:

```
Player_Value (in Cr) = 
    Base_Value 
  + Performance_Premium 
  + Scarcity_Premium 
  + Age_Adjustment 
  + Fitness_Adjustment 
  + Marketability_Bonus (optional for franchises caring about brand)
```

#### Components:

**Base Value:**
```
Base = (WAR x League_Avg_Cost_Per_WAR)
```

**Performance Premium:**
```
If player is top 10% in key metrics for their role → +30-50% premium
If player has won Player of Match > 5 times in last 2 seasons → +20%
```

**Scarcity Premium:**
```
Count players in auction pool who can fill same role at similar quality.
If < 3 alternatives → +40-60% premium
If 3-5 alternatives → +20% premium
If > 5 alternatives → no premium
```

**Age Adjustment:**
```
Age 20-24: +15% (development upside)
Age 25-30: 0% (peak years)
Age 31-33: -10% (early decline)
Age 34+:   -25% (significant decline risk)
```

**Fitness Adjustment:**
```
Matches missed due to injury in last 2 years:
0-5%:   0% adjustment
5-15%:  -10%
15-30%: -20%
30%+:   -35%
```

### 12.2 Auction Strategy Framework

#### Pre-Auction

1. **Define squad needs** using Gap Analysis (Section 11.3)
2. **Create tiered shortlists** for each gap:
   - Tier 1: Primary target (best fit)
   - Tier 2: Strong alternative (80% of Tier 1 quality, 60% of price)
   - Tier 3: Value pick (70% quality, 30% price)
3. **Set maximum bid prices** for each player using valuation model
4. **Game-theory analysis**: Predict which teams will bid for your targets

#### During Auction

5. **Track remaining purse** of all teams in real-time
6. **Monitor rival purchases** — adjust if a rival fills their gap (reduces competition for shared targets)
7. **Identify falling values** — when expected expensive players go cheap, be ready to pivot
8. **Enforce discipline** — never exceed max bid price (anchoring bias is the biggest auction mistake)
9. **Use Right-to-Match (RTM) strategically** — RTM at the last bid, don't reveal interest early

#### Post-Auction

10. **Re-evaluate squad balance** — any remaining gaps?
11. **Identify trade targets** — can you trade with other teams pre-season?
12. **Plan development** — which young players to fast-track?

### 12.3 Salary Cap Optimisation

```
Maximise: Team_Strength = Σ Player_Rating(i)
Subject to:
    Σ Player_Salary(i) ≤ Salary_Cap
    Overseas_Count ≤ 8 (squad), 4 (XI)
    Squad_Size between 18-25
    Must have: min 2 WK, 4 pacers, 2 spinners, 2 all-rounders
```

This is a constrained optimisation problem — solvable with linear programming or genetic algorithms.

### 12.4 Value Picks Identification

Look for undervalued players using:

```
Value_Score = Player_Rating / Expected_Price

If Value_Score > 1.5 → Strong value pick
If Value_Score > 2.0 → Must-buy territory
```

Undervaluation typically happens when:
- Player had injury in recent season (but underlying metrics are strong)
- Player performed in less-visible league (e.g., Lanka Premier League)
- Player's xStats >> actual stats (unlucky, but skills are elite)
- Player changed role recently (e.g., opener to middle order) and sample is small
- Age bias (31-year-old fast bowler with excellent fitness record)

---

## 13. Opposition & Matchup Analysis

### 13.1 Batter vs. Bowler Matchups

For every likely opposition combination, calculate:

```
Matchup Table:
Batter A vs. Bowler X: 45 balls, 62 runs, 3 dismissals, SR 137.7
Batter A vs. Bowler Y: 28 balls, 22 runs, 4 dismissals, SR 78.5 ← EXPLOITABLE
```

**Important**: Small sample sizes plague matchup data. Use Bayesian averaging:

```
Adj_SR_vs_Bowler = (n x SR_vs_Bowler + m x SR_overall) / (n + m)
where n = balls faced vs. bowler, m = 30 (prior weight)
```

### 13.2 Team vs. Team Analysis

| Metric | Our Team | Opposition |
|--------|----------|------------|
| H2H Record (last 3 years) | | |
| H2H at this venue | | |
| PP Average Score | | |
| Death Economy | | |
| Chase Success % | | |
| Key Matchup Advantage | | |

### 13.3 Wagon Wheel Analysis

Map scoring zones for each batter:

```
        Fine Leg    |    Third Man
           \        |        /
    Sq Leg  \       |       /  Point
             \      |      /
    Mid-Wkt   \     |     /   Cover
               \    |    /
    Mid-On      \   |   /    Mid-Off
                 \  |  /
    Long-On       \ | /      Long-Off
                   \|/
```

For each zone, calculate: Runs scored, SR, Boundary %, Dismissal %

This reveals:
- Dominant scoring areas (field accordingly)
- Weak zones (bowl to these areas)
- Boundary-hitting arcs

### 13.4 Pitch Maps / Beehive Analysis

For each bowler, map where deliveries pitch:

```
     |  Full  |  Good  |  Short  |
Off  |  23%   |  45%   |   8%    |
Mid  |  12%   |   7%   |   2%    |
Leg  |   1%   |   1%   |   1%    |
```

Overlay with batter's weakness zones to find optimal bowling strategies.

### 13.5 Field Placement Optimisation

Using wagon wheel data + match phase:

```
For each batter:
    1. Identify top 3 scoring zones
    2. Calculate P(boundary) in each zone
    3. Calculate P(dot) with fielder in zone
    4. Optimise field placement to minimise expected runs:
    
    E(Runs) = Σ P(shot_to_zone_i) x E(Runs_from_zone_i | fielder_placement)
```

---

## 14. Conditions & Venue Analysis

### 14.1 Venue Database

For each IPL venue, maintain:

| Attribute | Data |
|-----------|------|
| Average 1st innings score | Historical average |
| Average 2nd innings score | Historical average |
| Chase success % | Win % batting second |
| Toss advantage | Bat first vs. field first win % |
| Pace vs. Spin | Which type is more effective (avg, SR, economy) |
| Boundary size | Dimensions in meters for each zone |
| Dew factor | Rating 1-5 (how much dew affects later innings) |
| Pitch type | Red soil, black soil, drop-in, etc. |
| Avg seam movement | mm of deviation in first 6 overs |
| Avg spin turn | degrees of turn in middle overs |

### 14.2 Key IPL Venue Profiles (Example Framework)

```
VENUE: Wankhede Stadium, Mumbai
Avg 1st Innings: 175
Avg 2nd Innings: 162
Chase Win %: 52%
Toss Impact: Moderate (field first slight advantage due to dew)
Pace Effectiveness: High (sea breeze, evening swing)
Spin Effectiveness: Moderate
Boundary: Short straight, medium square
Key Strategy: Bat first unless significant dew, use pace in PP
```

### 14.3 Conditions Matrix

```
             Batting-     Balanced    Bowling-
             Friendly                 Friendly
Pace-Friendly  Wankhede    Mohali      Dharamsala
Spin-Friendly  Chinnaswamy  Chepauk    Ahmedabad (spin)
Balanced       Bangalore    Delhi      Kolkata
```

### 14.4 Weather & External Factors

Track and factor in:
- Temperature (affects ball swing/seam)
- Humidity (dew probability)
- Wind speed & direction (affects short boundaries)
- Day vs. Night (pink ball, dew, visibility)
- Altitude (Dharamsala — ball carries more)

---

## 15. Scouting from Domestic & International Leagues

### 15.1 Global T20 Leagues to Scout

| League | Country | Season | Key Value |
|--------|---------|--------|-----------|
| **IPL** | India | Apr-Jun | The benchmark |
| **BBL** (Big Bash) | Australia | Dec-Jan | Bouncy conditions, pace |
| **PSL** (Pakistan Super League) | Pakistan | Feb-Mar | Swing conditions, young pacers |
| **CPL** (Caribbean Premier League) | West Indies | Aug-Sep | Spin-friendly, power hitters |
| **SA20** | South Africa | Jan-Feb | Quality pace, bounce |
| **The Hundred** | England | Jul-Aug | Swing, conditions similar to English pitches |
| **BPL** (Bangladesh PL) | Bangladesh | Jan-Feb | Spin paradise, value picks |
| **LPL** (Lanka PL) | Sri Lanka | Jul-Aug | Spin, emerging talent |
| **ILT20** | UAE | Jan-Feb | Flat pitches, dew factor |
| **MLC** (Major League Cricket) | USA | Jul | Growing talent pool |
| **T20 Blast / Vitality Blast** | England | May-Sep | County talent, consistent performers |
| **SMAT** (Syed Mushtaq Ali) | India | Oct-Nov | Uncapped Indian talent pool |
| **Vijay Hazare Trophy** | India | Nov-Dec | List A domestic — ODI talent |
| **Ranji Trophy** | India | Jan-Mar | First-class — Tests talent |

### 15.2 Cross-League Performance Adjustment

Different leagues have different difficulty levels. Adjust stats:

```
Adjusted_Stat = Raw_Stat x (IPL_Avg / Source_League_Avg)

Example:
Player scores at SR 155 in BPL where avg SR is 135
IPL avg SR is 140
Adjusted_SR = 155 x (140/135) = 160.7
```

But also apply a **quality discount**:
```
Quality_Factor = Source_League_Rating / IPL_Rating
where league ratings are based on average player quality (international caps %)

Final_Adjusted_Stat = Adjusted_Stat x Quality_Factor
```

### 15.3 Scouting Checklist for Unknown Players

When evaluating a player from a lesser-known league:

| Factor | Check |
|--------|-------|
| **Technical** | Does technique hold up against quality pace/spin? Video review |
| **Physical** | Fitness levels for Indian conditions (heat, humidity) |
| **Temperament** | Performance in knockouts/high-pressure games |
| **Adaptability** | Has played in multiple leagues/conditions? |
| **Age Profile** | Young enough for development? Peak age for immediate impact? |
| **Sample Size** | Minimum 15 innings / 200 balls bowled for reliable stats |
| **Trend** | Improving, stable, or declining over last 2 seasons? |
| **Red Flags** | Injury history, attitude concerns, disciplinary issues |

### 15.4 Domestic Indian Player Scouting

For uncapped Indian players (huge IPL value):

1. **SMAT Performance**: T20 stats in Syed Mushtaq Ali Trophy
2. **Ranji Performance**: First-class stats (for Test-format skills that translate — technique, temperament)
3. **India A / Emerging Teams**: Has the player been selected? 
4. **IPL Nets / Trials**: Reports from team practice sessions
5. **Age-Group Cricket**: U-19 records, youth tournaments
6. **Fitness Data**: Yo-Yo test scores, body composition reports

---

## 16. Building Dashboards & Reports

### 16.1 Essential Dashboards

| Dashboard | Contents | Audience |
|-----------|----------|----------|
| **Player Profile** | All stats, phase splits, matchups, trend graphs | Analysts, coaches |
| **Team Overview** | Squad balance, phase analysis, SWOT summary | Management |
| **Auction War Room** | Player shortlists, valuations, budget tracker | Auction team |
| **Match Preview** | Opposition analysis, conditions, recommended XI | Captain, coach |
| **Match Review** | Performance vs. expectations, key moments, improvements | Post-match debrief |
| **Season Tracker** | Points table predictions, NRR tracking, playoff scenarios | Management |

### 16.2 Visualisations to Build

| Visualisation | Purpose |
|--------------|---------|
| **Wagon Wheels** | Batter scoring zones |
| **Pitch Maps** | Bowler delivery locations |
| **Beehive Charts** | Ball impact on stumps |
| **Spider Graphs** | Multi-dimensional player comparison |
| **Heat Maps** | Scoring rate by over number |
| **Win Probability Graphs** | Ball-by-ball win probability curves |
| **Phase Bar Charts** | Team/player performance by phase |
| **Scatter Plots** | Average vs. SR (batting), Economy vs. SR (bowling) |
| **Network Graphs** | Partnership analysis |
| **Trend Lines** | Rolling average of key metrics over time |

### 16.3 Report Templates

#### Pre-Match Report (1-2 pages)

```
MATCH: [Team A] vs [Team B]
DATE: [Date] | VENUE: [Venue] | TIME: [Time]

1. VENUE PROFILE (3 lines)
2. CONDITIONS (Weather, pitch report, toss recommendation)
3. OPPOSITION KEY THREATS (Top 3 players with key stats)
4. MATCHUP ADVANTAGES (Our best matchups vs. their XI)
5. RECOMMENDED XI (With rationale for any changes)
6. BOWLING PLAN (Phase-by-phase plan vs. their top 4 batters)
7. BATTING PLAN (Key bowlers to target, phases to accelerate)
8. KEY BATTLES (3 matchups that will decide the game)
```

#### Post-Match Report (1-2 pages)

```
RESULT: [Team A] beat [Team B] by [margin]

1. SCORECARD SUMMARY
2. KEY PERFORMANCES (Above/below expectation using xR, xW)
3. PHASE ANALYSIS (Where we won/lost the game)
4. CRITICAL MOMENTS (Win probability swings > 10%)
5. TACTICAL REVIEW (What worked, what didn't)
6. INDIVIDUAL FEEDBACK (Performance vs. plan for key players)
7. ACTION ITEMS (2-3 specific areas to address before next game)
```

---

## 17. Tools & Technology Stack

### 17.1 Programming & Data Science

| Tool | Use |
|------|-----|
| **Python** | Primary language for data analysis |
| **pandas** | Data manipulation and analysis |
| **NumPy** | Numerical computations |
| **scikit-learn** | Machine learning models |
| **matplotlib / seaborn** | Static visualisations |
| **Plotly** | Interactive visualisations |
| **Streamlit** | Quick dashboards and web apps |
| **R** | Statistical modelling (alternative to Python) |

### 17.2 Database & Storage

| Tool | Use |
|------|-----|
| **PostgreSQL** | Primary database for structured cricket data |
| **SQLite** | Lightweight local database |
| **MongoDB** | Unstructured data (commentary, articles) |
| **Google BigQuery** | Large-scale querying |

### 17.3 Visualisation & BI

| Tool | Use |
|------|-----|
| **Tableau** | Enterprise-grade dashboards |
| **Power BI** | Microsoft ecosystem dashboards |
| **Grafana** | Real-time monitoring dashboards |
| **D3.js** | Custom web-based visualisations |
| **Google Sheets** | Quick sharing and collaboration |

### 17.4 Video Analysis

| Tool | Use |
|------|-----|
| **Hudl / Sportscode** | Professional video tagging and analysis |
| **Dartfish** | Biomechanical analysis |
| **Kinemaster / DaVinci Resolve** | Video editing for compilations |

### 17.5 Data Collection & Automation

| Tool | Use |
|------|-----|
| **Beautiful Soup / Scrapy** | Web scraping (within legal/ethical bounds) |
| **Cricsheet Python library** | Parse Cricsheet YAML data |
| **APIs** | CricAPI, ESPNcricinfo (unofficial) |
| **Airflow / Cron** | Automated data pipeline scheduling |

### 17.6 Recommended Python Libraries for Cricket

```python
# Data
import pandas as pd
import numpy as np
from cricsheet import CricsheetLoader  # or custom YAML parser

# Analysis
from scipy import stats
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# Visualisation
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go

# Dashboard
import streamlit as st
```

---

## 18. Presenting to Team Management

### 18.1 Communication Principles

1. **Lead with the insight, not the methodology**
   - Bad: "Using a K-means clustering algorithm with 5 clusters on 2,847 data points..."
   - Good: "There are 5 types of death bowlers, and we're missing Type 2 — the yorker specialist."

2. **One page, one message**
   - Every report page should have a single, clear takeaway
   - Use the headline to state the conclusion, not the topic

3. **Visualise, don't tabulate**
   - Use charts and graphs over tables wherever possible
   - Use colour coding: Green (strength), Red (weakness), Yellow (average)

4. **Provide options, not orders**
   - "Here are 3 options for our death bowling gap, ranked by value and fit"
   - Let management make the final call

5. **Quantify uncertainty**
   - "Player X has a 70% chance of maintaining SR > 150" not "Player X will score at 150"

### 18.2 Analyst Credibility Builders

- Track your predictions: Keep a record of your pre-match predictions and grade yourself
- Admit uncertainty: "The sample size is only 12 innings, so confidence is moderate"
- Show both sides: Present risks alongside upside for every player recommendation
- Be prepared to be wrong: Have a pre-planned response for when your analysis doesn't work out

### 18.3 Meeting Structure with Coaching Staff

```
1. Situation (2 min): Where we stand (results, squad, conditions)
2. Analysis (5 min): Key findings with supporting data
3. Recommendations (3 min): 2-3 actionable options
4. Discussion (10 min): Coach/management feedback, questions
5. Decision (2 min): Agree on action
```

---

## 19. Case Studies & Practical Examples

### 19.1 Case Study: Identifying an Undervalued Death Bowler

**Problem**: Team needs a death bowler. Budget: 3 Cr max.

**Step 1 — Define the profile:**
- Economy < 9.0 in overs 16-20
- Dot ball % > 30% at death
- Yorker % > 25%
- Wide % < 8%
- Minimum 40 death overs bowled in T20s

**Step 2 — Query the database:**
```sql
SELECT player_name, 
       AVG(economy_death) as death_economy,
       AVG(dot_pct_death) as death_dot_pct,
       AVG(yorker_pct) as yorker_pct,
       AVG(wide_pct) as wide_pct,
       COUNT(DISTINCT match_id) as matches
FROM bowling_phase_stats
WHERE phase = 'death' 
  AND format = 'T20'
  AND season IN ('2024', '2025')
GROUP BY player_name
HAVING COUNT(DISTINCT match_id) >= 10
  AND AVG(economy_death) < 9.0
  AND AVG(dot_pct_death) > 0.30
ORDER BY death_economy ASC;
```

**Step 3 — Apply valuation model and cross-reference with auction base price.**

**Step 4 — Present shortlist of 5 players with spider charts comparing them.**

### 19.2 Case Study: Auction Simulation

**Problem**: Team has 25 Cr remaining, needs 3 players (1 overseas pacer, 1 Indian spinner, 1 Indian batter).

**Approach**: Monte Carlo simulation

```python
import random

def simulate_auction(budget, needs, player_pool, n_simulations=10000):
    best_squads = []
    
    for _ in range(n_simulations):
        remaining = budget
        squad = []
        
        for need in needs:
            eligible = [p for p in player_pool 
                       if p['role'] == need['role'] 
                       and p['category'] == need['category']
                       and p['expected_price'] <= remaining]
            
            if eligible:
                # Add randomness to price (auction unpredictability)
                player = random.choice(eligible)
                price = player['expected_price'] * random.uniform(0.7, 1.5)
                price = min(price, remaining)
                
                squad.append((player['name'], price))
                remaining -= price
        
        if len(squad) == len(needs):
            squad_rating = sum(p['rating'] for p in squad)
            best_squads.append((squad, squad_rating, remaining))
    
    return sorted(best_squads, key=lambda x: x[1], reverse=True)[:10]
```

### 19.3 Case Study: Mid-Season Tactical Adjustment

**Situation**: Team is 5 matches in, losing 3. Data shows death bowling economy is 11.2.

**Analysis Process**:
1. Break down death overs ball-by-ball
2. Identify: 40% of boundaries come from slot balls (back-of-length)
3. Compare yorker % (18%) vs. league average (28%)
4. Identify bowling change options from squad

**Recommendation**:
- Promote Player Y (yorker % of 35% in nets/domestic) to death role
- Demote Player Z to middle overs where his economy is 6.8
- Practice plan: 200 yorkers per session for designated death bowlers

---

## 20. Glossary of Terms

| Term | Definition |
|------|------------|
| **Average** | Runs scored per dismissal (batting) or runs conceded per wicket (bowling) |
| **Bayesian Averaging** | Statistical technique to adjust small sample sizes toward population mean |
| **Beehive** | Dot chart showing where deliveries pass the stumps |
| **Boundary %** | Percentage of runs scored from boundaries |
| **Clustering** | Grouping similar players together using machine learning |
| **Control %** | Percentage of deliveries that hit the intended target area |
| **Death Overs** | Overs 16-20 in T20, 40-50 in ODI |
| **Dot Ball %** | Percentage of deliveries that result in zero runs |
| **DLS** | Duckworth-Lewis-Stern method for rain-affected matches |
| **Economy Rate** | Runs conceded per over |
| **Expected Average (xAvg)** | Predicted average based on quality of contact and shot selection |
| **Expected Runs (xR)** | Predicted runs based on delivery attributes |
| **Expected Wickets (xW)** | Predicted wickets based on delivery quality |
| **False Shot %** | Percentage of deliveries where batter misses or mis-hits |
| **FWSR** | First Wicket Strike Rate — team's scoring rate before losing first wicket |
| **Impact Player** | IPL rule allowing a 12th player to substitute in (changes team balance) |
| **Matchup** | Head-to-head record between specific batter and bowler |
| **Middle Overs** | Overs 7-15 in T20, 11-40 in ODI |
| **Monte Carlo** | Simulation method using random sampling to model outcomes |
| **NRR** | Net Run Rate — used to separate teams on same points |
| **Phase** | Segment of innings (Powerplay, Middle, Death) |
| **Pitch Map** | Visualisation of where deliveries land on the pitch |
| **Powerplay** | Overs 1-6 (mandatory fielding restrictions) |
| **Pressure Index** | Custom metric quantifying match situation pressure |
| **RTM** | Right to Match — IPL rule allowing team to match winning bid for retained player |
| **Replacement Level** | Performance expected from a freely available (bench/uncapped) player |
| **SR (Strike Rate)** | Batting: runs per 100 balls. Bowling: balls per wicket |
| **SWOT** | Strengths, Weaknesses, Opportunities, Threats analysis |
| **Wagon Wheel** | Visualisation showing direction of shots played |
| **WAR** | Wins Above Replacement — composite value metric |
| **Win Probability** | Model-estimated chance of winning at any point in a match |
| **xW** | Expected Wickets |
| **xR** | Expected Runs |

---

## Quick Reference: The 10 Stats That Matter Most in T20 Cricket

1. **Strike Rate (by phase)** — not overall, phase-specific
2. **Dot Ball %** — for both batting and bowling
3. **Boundary %** — percentage of runs from 4s and 6s
4. **Death Overs Economy** — the single most predictive team stat
5. **Expected Wickets (xW)** — separates skill from luck in bowling
6. **Average vs. Quality Opposition** — filters out stat-padding
7. **Phase-Wise Splits** — every metric broken by PP/Middle/Death
8. **Pressure Performance** — stats when chasing 180+ or defending <150
9. **Matchup Data** — batter vs. bowler type (pace/spin, left/right)
10. **Consistency Score** — standard deviation of performance (lower = more reliable)

---

## Final Advice for Aspiring Cricket Analysts

1. **Start with Cricsheet data** — it is free and comprehensive. Build projects with it.
2. **Learn Python and SQL** — these are non-negotiable technical skills.
3. **Watch cricket analytically** — don't just enjoy; observe field placements, bowling changes, batting approaches.
4. **Build a portfolio** — publish analyses on Twitter/X, LinkedIn, or a blog. IPL teams notice good public analysts.
5. **Network** — connect with team analysts, coaches, and data scientists in cricket on LinkedIn and at events.
6. **Understand the game deeply** — stats without cricketing context are dangerous. Play, watch, discuss.
7. **Stay humble with small samples** — T20 cricket generates small datasets. Always communicate uncertainty.
8. **Think in probabilities, not certainties** — "70% chance of success" is more honest and useful than "he will succeed."
9. **Study other sports analytics** — baseball (sabermetrics), football (xG), basketball (PER) have mature analytics you can adapt.
10. **Be ready to be wrong** — the best analysts are right 60-65% of the time. The value is in the process, not perfection.

---

*This document is a living reference. Update it as new metrics, tools, and methodologies emerge in cricket analytics.*
