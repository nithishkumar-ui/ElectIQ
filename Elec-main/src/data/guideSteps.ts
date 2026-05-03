export const GUIDE_STEPS = [
  {
    id: 1,
    title: "Check Your Eligibility",
    summary: "Confirm you meet the age, citizenship, and residency requirements to vote.",
    body: "In most jurisdictions, voters must be citizens of legal voting age (e.g., 18 in the US, UK, and India) and residents of the area where they wish to vote. Some states permit 17-year-olds to vote in primary elections if they turn 18 before the general election. Common disqualifications can be highly nuanced: for example, felony convictions may result in temporary or permanent disenfranchisement depending on the state, although many jurisdictions have specific administrative processes to restore voting rights upon completion of a sentence (which may include the completion of parole, probation, or payment of fines). Additionally, a formal court declaration of mental incapacitation can disqualify a voter, though the legal threshold and terminology for this varies greatly by municipality and state laws.",
    checklist: [
      "I am a citizen of the country where I wish to vote",
      "I meet the minimum age requirement",
      "I am a resident of the jurisdiction where I want to vote",
      "I have not been disenfranchised by a court ruling"
    ],
    callout: "Eligibility and disqualification rules vary significantly depending on your country, state, and local municipality. Ask the AI below to verify the specific voting requirements and restoration rights for your exact location."
  },
  {
    id: 2,
    title: "Register to Vote",
    summary: "Complete your voter registration before the deadline in your jurisdiction.",
    body: "Voter registration adds your name to the official list of eligible voters. In the US, most states require registration 15–30 days before an election, though 21 states and Washington D.C. offer same-day registration. You can typically register online, by mail, or in person at a DMV or election office. Keep your registration updated if you move or change your name.",
    checklist: [
      "I know the voter registration deadline in my jurisdiction",
      "I have registered online, by mail, or in person",
      "My registration reflects my current address",
      "I have confirmed my registration status"
    ],
    callout: "Check your voter registration status at vote.gov (US) or your national election commission website."
  },
  {
    id: 3,
    title: "Understand Your Ballot Options",
    summary: "Learn the different ways you can cast your vote before deciding.",
    body: "Most jurisdictions offer multiple ways to vote. In-person voting on Election Day is the traditional method. Early voting allows you to vote at designated locations for a set period before Election Day. Absentee or mail-in voting lets you request a ballot by mail and return it before the deadline. Some states have universal vote-by-mail.",
    checklist: [
      "I know whether my state offers early in-person voting",
      "I know if I am eligible for a mail-in or absentee ballot",
      "I understand the deadline to request and return a mail ballot",
      "I have decided which voting method I will use"
    ],
    callout: "Mail-in ballots must often be requested well in advance. Missing the request deadline means you must vote in person."
  },
  {
    id: 4,
    title: "Find Your Polling Place",
    summary: "Locate your assigned polling location and check its hours and accessibility.",
    body: "Your polling place is determined by your registered address. Use your state's election website or vote.gov to find your location. Most US polling places are open from 6am to 8pm, but hours vary by state. If you need accessible facilities, contact your local election office in advance. Bring an acceptable photo ID if your state requires one.",
    checklist: [
      "I have looked up my assigned polling location",
      "I know the polling hours in my jurisdiction",
      "I know what ID (if any) I need to bring",
      "I have a plan for getting to the polls"
    ],
    callout: "If your polling place is inaccessible, contact your local election office to request accommodation or a curbside ballot."
  },
  {
    id: 5,
    title: "Cast Your Vote on Election Day",
    summary: "What to expect when you arrive at the polls and how to cast your ballot.",
    body: "When you arrive, poll workers will verify your identity and registration. You will receive a ballot — paper or electronic. Mark your choices clearly and follow all instructions. Submit your ballot and receive your 'I Voted' sticker. If your eligibility is questioned, you have the right to cast a provisional ballot, which will be counted once eligibility is confirmed.",
    checklist: [
      "I know the acceptable forms of ID in my state",
      "I know what races and measures are on my ballot",
      "I understand how to mark my ballot correctly",
      "I know I can cast a provisional ballot if needed"
    ],
    callout: "If you are in line before polls close, you have the right to vote — stay in line even after closing time is announced."
  },
  {
    id: 6,
    title: "After You Vote",
    summary: "How your vote is counted, certified, and what happens next.",
    body: "After polls close, ballots are transported to counting centers under strict chain-of-custody procedures. Results are tallied precinct by precinct and reported to county and state officials. Mail-in ballots may take days or weeks to count. Official results are certified by each state — for US federal elections this happens weeks after Election Day.",
    checklist: [
      "I understand that election night results are unofficial",
      "I know mail-in ballots take longer to count",
      "I understand what the certification process means",
      "I know when the new official takes office"
    ],
    callout: "Unofficial results on election night may differ from certified results once all mail-in and provisional ballots are counted."
  }
];
