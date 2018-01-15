const PresentAndPast = {
  "name": "presentpastconditions",
  "question": "Have you had OR do you presently have any of the following conditions? (Check if yes.)",
  "type": "checkbox",
  "items": [
  { id: "1", t: "Rheumatic fever" },
  { id: "2", t: "Recent operation" },
  { id: "3", t: "Edema (swelling of ankles)" },
  { id: "4", t: "High blood pressure" },
  { id: "5", t: "Injury to back or knees" },
  { id: "6", t: "Low blood pressure" },
  { id: "7", t: "Seizures" },
  { id: "8", t: "Lung disease" },
  { id: "9", t: "Heart attack" },
  { id: "9", t: "Fainting or dizziness with or without physical exertion" },
  { id: "10", t: "Diabetes" },
  { id: "11", t: "High cholesterol" },
  { id: "12", t: "Orthopnea (the need to sit up to breathe comfortably) or paroxysmal (sudden, unexpected attack) nocturnal" },
  { id: "13", t: "dyspnea (shortness of breath at night)" },
  { id: "14", t: "Shortness of breath at rest or with mild exertion" },
  { id: "15", t: "Chest pains" },
  { id: "16", t: "Palpitations or tachycardia (unusually strong or rapid heartbeat)" },
  { id: "17", t: "Intermittent claudication (calf cramping)" },
  { id: "18", t: "Pain, discomfort in the chest, neck, jaw, arms, or other areas with or without physical exertion" },
  { id: "19", t: "Known heart murmur" },
  { id: "20", t: "Unusual fatigue or shortness of breath with usual activities" },
  { id: "21", t: "Temporary loss of visual acuity or speech, or short-term numbness or weakness in one side, arm, or leg of" },
  { id: "22", t: "your body" },
  { id: "23", t: "Other" },
  { id: "none", t: "None"}
  ]
}

const FamilyHistory =  {
  "name": "familyhistory",
  "question": "Have any of your first-degree relatives (parent, sibling, or child) experienced the following conditions?",
  "type": "checkbox",
  "items": [
    { id: "1", t: "Heart arrhythmia" },
    { id: "2", t: "Heart attack" },
    { id: "3", t: "Heart operation" },
    { id: "4", t: "Congenital heart disease" },
    { id: "5", t: "Premature death before age 50" },
    { id: "6", t: "Significant disability secondary to a heart condition" },
    { id: "7", t: "Marfan syndrome" },
    { id: "8", t: "High blood pressure" },
    { id: "9", t: "High cholesterol" },
    { id: "10", t: "Diabetes" },
    { id: "none", t: "None"}
  ]
}

const Observation = {
  "items": [
    {
      "id": "ipohondrie",
      "t": "Very often"
    }, {
      "id": "ok",
      "t": "A few times a year"
    }, {
      "id": "recklessness",
      "t": "Rarely"
    }
  ],
  "name": "observation",
  "question": "How often do you undergo medical observation?",
  "type": "radio"
}


const EstimateHP = {
  "items": [
    {
      "id": "good",
      "t": "Good Health"
    }, {
      "id": "so-so",
      "t": "Generally good."
    }, {
      "id": "poor",
      "t": "Bad health"
    }
  ],
  "name": "health",
  "question": "How do you estimate how healthy you are?",
  "type": "radio"
}


const SeriousMedicalIntervention = {
  "items": [
    {
      "id": "yes",
      "t": "Yes"
    }, {
      "id": "no",
      "t": "No"
    }
  ],
  "name": "intervention",
  "question": "Are you having a serious medical intervention in the near future?",
  "type": "radio"
}



export default {
  "active": true,
  "category": "configuration",
  "data": [
    [
      {
        "description": "Personal and Family history of diseases",
        "title": "Diseases history",
        "type": "header"
      },
      PresentAndPast,
      FamilyHistory
    ], [
      {
        "title": "Health condition",
        "description": "Your current health condition",
        "type": "header"
      },
      EstimateHP, Observation, SeriousMedicalIntervention
    ]
  ],
  "providerId": "ru.rosalind.genetics",
  "questionnaireId": "medical.questionnaire",
  "title": "Medical questionnaire",
  "type": "questionnaire"
}
