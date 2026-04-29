# Squads — IPL 2026

**Source:** `public/data/squads-2026.json`
**Consumed by:** `Teams.tsx`, `TeamDetail.tsx` squad tab
**Structure:** Object keyed by full team name → `{ captain, coach, players: [...] }`
**Companion file:** `squad-name-mapping.json` (maps display names → player IDs in `players.json`)

## Schema

```
{ [teamName]: {
    captain: string,
    coach: string | "N/A",
    players: Array<{
      name: string,
      role: "Batter" | "WK-Batter" | "All-Rounder" | "Bowler",
      overseas: boolean,
      price: string,     // e.g. "18 Cr" or "N/A"
      retained: boolean  // R = retained from previous cycle
    }>
} }
```

Legend for the tables below: **R** = retained, **A** = acquired (auction/trade/free-agent), **OVS** = overseas.

## Chennai Super Kings — Captain: Ruturaj Gaikwad · Coach: Stephen Fleming (25 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | Ruturaj Gaikwad | Batter | — | R | 18 Cr |
| 2 | MS Dhoni | WK-Batter | — | R | 4 Cr |
| 3 | Sanju Samson | WK-Batter | — | A | N/A |
| 4 | Dewald Brevis | Batter | ✅ | A | N/A |
| 5 | Ayush Mhatre | Batter | — | A | N/A |
| 6 | Kartik Sharma | Batter | — | A | N/A |
| 7 | Sarfaraz Khan | Batter | — | A | N/A |
| 8 | Urvil Patel | WK-Batter | — | A | N/A |
| 9 | Jamie Overton | All-Rounder | ✅ | A | N/A |
| 10 | Ramakrishna Ghosh | All-Rounder | — | A | N/A |
| 11 | Prashant Veer | All-Rounder | — | A | N/A |
| 12 | Matthew Short | All-Rounder | ✅ | A | N/A |
| 13 | Aman Khan | All-Rounder | — | A | N/A |
| 14 | Zak Foulkes | All-Rounder | ✅ | A | N/A |
| 15 | Shivam Dube | All-Rounder | — | A | N/A |
| 16 | Khaleel Ahmed | Bowler | — | A | N/A |
| 17 | Noor Ahmad | Bowler | ✅ | A | N/A |
| 18 | Anshul Kamboj | Bowler | — | A | N/A |
| 19 | Mukesh Choudhary | Bowler | — | A | N/A |
| 20 | Shreyas Gopal | Bowler | — | A | N/A |
| 21 | Gurjapneet Singh | Bowler | — | A | N/A |
| 22 | Akeal Hosein | Bowler | ✅ | A | N/A |
| 23 | Matt Henry | Bowler | ✅ | A | N/A |
| 24 | Rahul Chahar | Bowler | — | A | N/A |
| 25 | Spencer Johnson | Bowler | ✅ | A | N/A |

## Delhi Capitals — Captain: KL Rahul (24 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | KL Rahul | WK-Batter | — | A | N/A |
| 2 | Karun Nair | Batter | — | A | N/A |
| 3 | David Miller | Batter | ✅ | A | N/A |
| 4 | Pathum Nissanka | Batter | ✅ | A | N/A |
| 5 | Sahil Parakh | Batter | — | A | N/A |
| 6 | Prithvi Shaw | Batter | — | A | N/A |
| 7 | Abishek Porel | WK-Batter | — | A | N/A |
| 8 | Tristan Stubbs | Batter | ✅ | A | N/A |
| 9 | Axar Patel | All-Rounder | — | A | N/A |
| 10 | Sameer Rizvi | All-Rounder | — | A | N/A |
| 11 | Ashutosh Sharma | All-Rounder | — | A | N/A |
| 12 | Vipraj Nigam | All-Rounder | — | A | N/A |
| 13 | Ajay Mandal | All-Rounder | — | A | N/A |
| 14 | Tripurana Vijay | All-Rounder | — | A | N/A |
| 15 | Madhav Tiwari | All-Rounder | — | A | N/A |
| 16 | Nitish Rana | All-Rounder | — | A | N/A |
| 17 | Mitchell Starc | Bowler | ✅ | A | N/A |
| 18 | T. Natarajan | Bowler | — | A | N/A |
| 19 | Mukesh Kumar | Bowler | — | A | N/A |
| 20 | Dushmantha Chameera | Bowler | ✅ | A | N/A |
| 21 | Auqib Nabi | Bowler | — | A | N/A |
| 22 | Lungisani Ngidi | Bowler | ✅ | A | N/A |
| 23 | Kyle Jamieson | Bowler | ✅ | A | N/A |
| 24 | Kuldeep Yadav | Bowler | — | A | N/A |

## Gujarat Titans — Captain: Shubman Gill (25 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | Shubman Gill | Batter | — | R | 16.5 Cr |
| 2 | Jos Buttler | WK-Batter | ✅ | A | N/A |
| 3 | Kumar Kushagra | WK-Batter | — | A | N/A |
| 4 | Anuj Rawat | WK-Batter | — | A | N/A |
| 5 | Tom Banton | WK-Batter | ✅ | A | N/A |
| 6 | Glenn Phillips | Batter | ✅ | A | N/A |
| 7 | Sai Sudharsan | Batter | — | R | N/A |
| 8 | Nishant Sindhu | All-Rounder | — | A | N/A |
| 9 | Washington Sundar | All-Rounder | — | A | N/A |
| 10 | Mohd. Arshad Khan | All-Rounder | — | A | N/A |
| 11 | Sai Kishore | All-Rounder | — | A | N/A |
| 12 | Jayant Yadav | All-Rounder | — | A | N/A |
| 13 | Jason Holder | All-Rounder | ✅ | A | N/A |
| 14 | Rahul Tewatia | All-Rounder | — | A | N/A |
| 15 | Shahrukh Khan | All-Rounder | — | A | N/A |
| 16 | Kagiso Rabada | Bowler | ✅ | A | N/A |
| 17 | Mohammed Siraj | Bowler | — | A | N/A |
| 18 | Prasidh Krishna | Bowler | — | A | N/A |
| 19 | Manav Suthar | Bowler | — | A | N/A |
| 20 | Gurnoor Singh Brar | Bowler | — | A | N/A |
| 21 | Ishant Sharma | Bowler | — | A | N/A |
| 22 | Ashok Sharma | Bowler | — | A | N/A |
| 23 | Luke Wood | Bowler | ✅ | A | N/A |
| 24 | Kulwant Khejroliya | Bowler | — | A | N/A |
| 25 | Rashid Khan | Bowler | ✅ | R | 18 Cr |

## Kolkata Knight Riders — Captain: Ajinkya Rahane (25 players)

| # | Player | Role | OVS | Status |
|---|---|---|:-:|:-:|
| 1 | Ajinkya Rahane | Batter | — | A |
| 2 | Rinku Singh | Batter | — | A |
| 3 | Angkrish Raghuvanshi | Batter | — | A |
| 4 | Manish Pandey | Batter | — | A |
| 5 | Finn Allen | Batter | ✅ | A |
| 6 | Tejasvi Singh | Batter | — | A |
| 7 | Rahul Tripathi | Batter | — | A |
| 8 | Tim Seifert | WK-Batter | ✅ | A |
| 9 | Rovman Powell | Batter | ✅ | A |
| 10 | Anukul Roy | All-Rounder | — | A |
| 11 | Cameron Green | All-Rounder | ✅ | A |
| 12 | Sarthak Ranjan | All-Rounder | — | A |
| 13 | Daksh Kamra | All-Rounder | — | A |
| 14 | Rachin Ravindra | All-Rounder | ✅ | A |
| 15 | Ramandeep Singh | All-Rounder | — | A |
| 16 | Sunil Narine | All-Rounder | ✅ | A |
| 17 | Blessing Muzarabani | Bowler | ✅ | A |
| 18 | Vaibhav Arora | Bowler | — | A |
| 19 | Matheesha Pathirana | Bowler | ✅ | A |
| 20 | Kartik Tyagi | Bowler | — | A |
| 21 | Prashant Solanki | Bowler | — | A |
| 22 | Saurabh Dubey | Bowler | — | A |
| 23 | Navdeep Saini | Bowler | — | A |
| 24 | Umran Malik | Bowler | — | A |
| 25 | Varun Chakaravarthy | Bowler | — | A |

## Lucknow Super Giants — Captain: Rishabh Pant (25 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | Rishabh Pant | WK-Batter | — | R | 27 Cr |
| 2 | Aiden Markram | Batter | ✅ | A | N/A |
| 3 | Himmat Singh | Batter | — | A | N/A |
| 4 | Matthew Breetzke | WK-Batter | ✅ | A | N/A |
| 5 | Mukul Choudhary | Batter | — | A | N/A |
| 6 | Akshat Raghuwanshi | Batter | — | A | N/A |
| 7 | Josh Inglis | WK-Batter | ✅ | A | N/A |
| 8 | Nicholas Pooran | WK-Batter | ✅ | A | N/A |
| 9 | Mitchell Marsh | All-Rounder | ✅ | A | N/A |
| 10 | Abdul Samad | All-Rounder | — | A | N/A |
| 11 | Shahbaz Ahamad | All-Rounder | — | A | N/A |
| 12 | Arshin Kulkarni | All-Rounder | — | A | N/A |
| 13 | Wanindu Hasaranga | All-Rounder | ✅ | A | N/A |
| 14 | Ayush Badoni | All-Rounder | — | A | N/A |
| 15 | Mohammad Shami | Bowler | — | A | N/A |
| 16 | Avesh Khan | Bowler | — | A | N/A |
| 17 | M. Siddharth | Bowler | — | A | N/A |
| 18 | Digvesh Singh | Bowler | — | A | N/A |
| 19 | Akash Singh | Bowler | — | A | N/A |
| 20 | Prince Yadav | Bowler | — | A | N/A |
| 21 | Arjun Tendulkar | Bowler | — | A | N/A |
| 22 | Anrich Nortje | Bowler | ✅ | A | N/A |
| 23 | Naman Tiwari | Bowler | — | A | N/A |
| 24 | Mayank Yadav | Bowler | — | R | N/A |
| 25 | Mohsin Khan | Bowler | — | A | N/A |

## Mumbai Indians — Captain: Hardik Pandya (25 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | Rohit Sharma | Batter | — | R | 16.3 Cr |
| 2 | Suryakumar Yadav | Batter | — | R | 16.35 Cr |
| 3 | Robin Minz | WK-Batter | — | A | N/A |
| 4 | Sherfane Rutherford | Batter | ✅ | A | N/A |
| 5 | Ryan Rickelton | WK-Batter | ✅ | A | N/A |
| 6 | Quinton de Kock | WK-Batter | ✅ | A | N/A |
| 7 | Danish Malewar | Batter | — | A | N/A |
| 8 | Tilak Varma | Batter | — | R | N/A |
| 9 | Hardik Pandya | All-Rounder | — | R | 16.35 Cr |
| 10 | Naman Dhir | All-Rounder | — | A | N/A |
| 11 | Mitchell Santner | All-Rounder | ✅ | A | N/A |
| 12 | Raj Angad Bawa | All-Rounder | — | A | N/A |
| 13 | Atharva Ankolekar | All-Rounder | — | A | N/A |
| 14 | Mayank Rawat | All-Rounder | — | A | N/A |
| 15 | Corbin Bosch | All-Rounder | ✅ | A | N/A |
| 16 | Will Jacks | All-Rounder | ✅ | A | N/A |
| 17 | Shardul Thakur | All-Rounder | — | A | N/A |
| 18 | Trent Boult | Bowler | ✅ | A | N/A |
| 19 | Mayank Markande | Bowler | — | A | N/A |
| 20 | Deepak Chahar | Bowler | — | A | N/A |
| 21 | Ashwani Kumar | Bowler | — | A | N/A |
| 22 | Raghu Sharma | Bowler | — | A | N/A |
| 23 | Mohammad Izhar | Bowler | — | A | N/A |
| 24 | Allah Ghazanfar | Bowler | ✅ | A | N/A |
| 25 | Jasprit Bumrah | Bowler | — | R | 18 Cr |

## Punjab Kings — Captain: Shreyas Iyer (25 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | Shreyas Iyer | Batter | — | R | 26.75 Cr |
| 2 | Nehal Wadhera | Batter | — | A | N/A |
| 3 | Vishnu Vinod | WK-Batter | — | A | N/A |
| 4 | Harnoor Pannu | Batter | — | A | N/A |
| 5 | Pyla Avinash | Batter | — | A | N/A |
| 6 | Prabhsimran Singh | WK-Batter | — | A | N/A |
| 7 | Shashank Singh | Batter | — | A | N/A |
| 8 | Marcus Stoinis | All-Rounder | ✅ | A | N/A |
| 9 | Harprett Brar | All-Rounder | — | A | N/A |
| 10 | Marco Jansen | All-Rounder | ✅ | A | N/A |
| 11 | Azmatullah Omarzai | All-Rounder | ✅ | A | N/A |
| 12 | Priyansh Arya | All-Rounder | — | A | N/A |
| 13 | Musheer Khan | All-Rounder | — | A | N/A |
| 14 | Suryansh Shedge | All-Rounder | — | A | N/A |
| 15 | Mitch Owen | All-Rounder | ✅ | A | N/A |
| 16 | Cooper Connolly | All-Rounder | ✅ | A | N/A |
| 17 | Ben Dwarshuis | All-Rounder | ✅ | A | N/A |
| 18 | Arshdeep Singh | Bowler | — | R | 18 Cr |
| 19 | Yuzvendra Chahal | Bowler | — | A | N/A |
| 20 | Vyshak Vijaykumar | Bowler | — | A | N/A |
| 21 | Yash Thakur | Bowler | — | A | N/A |
| 22 | Xavier Bartlett | Bowler | ✅ | A | N/A |
| 23 | Pravin Dubey | Bowler | — | A | N/A |
| 24 | Vishal Nishad | Bowler | — | A | N/A |
| 25 | Lockie Ferguson | Bowler | ✅ | A | N/A |

## Rajasthan Royals — Captain: Riyan Parag (25 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | Shubham Dubey | Batter | — | A | N/A |
| 2 | Vaibhav Suryavanshi | Batter | — | A | N/A |
| 3 | Donovan Ferreira | Batter | ✅ | A | N/A |
| 4 | Lhuan-Dre Pretorius | Batter | ✅ | A | N/A |
| 5 | Ravi Singh | Batter | — | A | N/A |
| 6 | Aman Rao Perala | Batter | — | A | N/A |
| 7 | Shimron Hetmyer | Batter | ✅ | A | N/A |
| 8 | Yashasvi Jaiswal | Batter | — | R | 18 Cr |
| 9 | Dhruv Jurel | WK-Batter | — | A | N/A |
| 10 | Riyan Parag | All-Rounder | — | R | N/A |
| 11 | Yudhvir Singh Charak | All-Rounder | — | A | N/A |
| 12 | Ravindra Jadeja | All-Rounder | — | A | N/A |
| 13 | Dasun Shanaka | All-Rounder | ✅ | A | N/A |
| 14 | Jofra Archer | Bowler | ✅ | R | N/A |
| 15 | Tushar Deshpande | Bowler | — | A | N/A |
| 16 | Kwena Maphaka | Bowler | ✅ | A | N/A |
| 17 | Ravi Bishnoi | Bowler | — | A | N/A |
| 18 | Sushant Mishra | Bowler | — | A | N/A |
| 19 | Yash Raj Punja | Bowler | — | A | N/A |
| 20 | Vignesh Puthur | Bowler | — | A | N/A |
| 21 | Brijesh Sharma | Bowler | — | A | N/A |
| 22 | Adam Milne | Bowler | ✅ | A | N/A |
| 23 | Kuldeep Sen | Bowler | — | A | N/A |
| 24 | Sandeep Sharma | Bowler | — | A | N/A |
| 25 | Nandre Burger | Bowler | ✅ | A | N/A |

## Royal Challengers Bengaluru — Captain: Virat Kohli (25 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | Rajat Patidar | Batter | — | R | N/A |
| 2 | Devdutt Padikkal | Batter | — | A | N/A |
| 3 | Virat Kohli | Batter | — | R | 21 Cr |
| 4 | Phil Salt | WK-Batter | ✅ | A | N/A |
| 5 | Jitesh Sharma | WK-Batter | — | A | N/A |
| 6 | Jordan Cox | WK-Batter | ✅ | A | N/A |
| 7 | Krunal Pandya | All-Rounder | — | A | N/A |
| 8 | Swapnil Singh | All-Rounder | — | A | N/A |
| 9 | Tim David | All-Rounder | ✅ | A | N/A |
| 10 | Romario Shepherd | All-Rounder | ✅ | A | N/A |
| 11 | Jacob Bethell | All-Rounder | ✅ | A | N/A |
| 12 | Venkatesh Iyer | All-Rounder | — | A | N/A |
| 13 | Satvik Deswal | All-Rounder | — | A | N/A |
| 14 | Mangesh Yadav | All-Rounder | — | A | N/A |
| 15 | Vicky Ostwal | All-Rounder | — | A | N/A |
| 16 | Vihaan Malhotra | All-Rounder | — | A | N/A |
| 17 | Kanishk Chouhan | All-Rounder | — | A | N/A |
| 18 | Josh Hazlewood | Bowler | ✅ | A | N/A |
| 19 | Rasikh Dar | Bowler | — | A | N/A |
| 20 | Suyash Sharma | Bowler | — | A | N/A |
| 21 | Bhuvneshwar Kumar | Bowler | — | A | N/A |
| 22 | Nuwan Thushara | Bowler | ✅ | A | N/A |
| 23 | Abinandan Singh | Bowler | — | A | N/A |
| 24 | Jacob Duffy | Bowler | ✅ | A | N/A |
| 25 | Yash Dayal | Bowler | — | R | N/A |

## Sunrisers Hyderabad — Captain: Pat Cummins (25 players)

| # | Player | Role | OVS | Status | Price |
|---|---|---|:-:|:-:|---|
| 1 | Ishan Kishan | WK-Batter | — | A | N/A |
| 2 | Aniket Verma | Batter | — | A | N/A |
| 3 | Smaran Ravichandran | Batter | — | A | N/A |
| 4 | Salil Arora | Batter | — | A | N/A |
| 5 | Heinrich Klaasen | WK-Batter | ✅ | R | 23 Cr |
| 6 | Travis Head | Batter | ✅ | R | N/A |
| 7 | Harshal Patel | All-Rounder | — | A | N/A |
| 8 | Kamindu Mendis | All-Rounder | ✅ | A | N/A |
| 9 | Harsh Dubey | All-Rounder | — | A | N/A |
| 10 | Brydon Carse | All-Rounder | ✅ | A | N/A |
| 11 | Shivang Kumar | All-Rounder | — | A | N/A |
| 12 | Krains Fuletra | All-Rounder | — | A | N/A |
| 13 | Liam Livingstone | All-Rounder | ✅ | A | N/A |
| 14 | David Payne | All-Rounder | ✅ | A | N/A |
| 15 | Abhishek Sharma | All-Rounder | — | R | 14 Cr |
| 16 | Nitish Kumar Reddy | All-Rounder | — | R | 6 Cr |
| 17 | Pat Cummins | Bowler | ✅ | A | N/A |
| 18 | Zeeshan Ansari | Bowler | — | A | N/A |
| 19 | Jaydev Unadkat | Bowler | — | A | N/A |
| 20 | Eshan Malinga | Bowler | — | A | N/A |
| 21 | Sakib Hussain | Bowler | — | A | N/A |
| 22 | Onkar Tarmale | Bowler | — | A | N/A |
| 23 | Amit Kumar | Bowler | — | A | N/A |
| 24 | Praful Hinge | Bowler | — | A | N/A |
| 25 | Shivam Mavi | Bowler | — | A | N/A |

## Notes

- `coach: "N/A"` for 9 of the 10 franchises means only CSK's head coach (Stephen Fleming) is currently recorded here. Head-coach context for the others lives in `coaches.json` (see `coaches.md`).
- Prices with `"N/A"` are entries where the source hasn't been annotated yet — typically non-retained buys that need backfill from auction data.
- `overseas: true` counts toward each franchise's 4-overseas-in-XI rule on matchday.
