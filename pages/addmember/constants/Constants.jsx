const ETHNICITIES = [
  // South Asian
  "South Asian (Gujarati)", "South Asian (Punjabi)", "South Asian (Tamil)", "South Asian (Bengali)",
  "South Asian (Malayali)", "South Asian (Telugu)", "South Asian (Marathi)", "South Asian (Rajasthani)",
  "South Asian (Pakistani - Punjabi)", "South Asian (Pakistani - Pashtun)", "South Asian (Pakistani - Sindhi)",
  "South Asian (Sri Lankan - Sinhalese)", "South Asian (Sri Lankan - Tamil)", "South Asian (Nepali)",
  "South Asian (Bhutanese)", "South Asian (Maldivian)",

  // East Asian
  "East Asian (Chinese - Mandarin)", "East Asian (Chinese - Cantonese)", "East Asian (Japanese)",
  "East Asian (Korean)", "East Asian (Taiwanese)", "East Asian (Mongolian)", "East Asian (Tibetan)",

  // Southeast Asian
  "Southeast Asian (Filipino - Tagalog)", "Southeast Asian (Filipino - Cebuano)", "Southeast Asian (Vietnamese)",
  "Southeast Asian (Thai)", "Southeast Asian (Indonesian - Javanese)", "Southeast Asian (Indonesian - Sundanese)",
  "Southeast Asian (Cambodian - Khmer)", "Southeast Asian (Lao)", "Southeast Asian (Malay)",
  "Southeast Asian (Myanmar - Burmese)", "Southeast Asian (Myanmar - Shan)",

  // Middle Eastern
  "Middle Eastern (Arab - Gulf)", "Middle Eastern (Arab - Levantine)", "Middle Eastern (Arab - Egyptian)",
  "Middle Eastern (Persian/Iranian)", "Middle Eastern (Kurdish)", "Middle Eastern (Turkish)",
  "Middle Eastern (Assyrian)", "Middle Eastern (Armenian)", "Middle Eastern (Azerbaijani)",
  "Middle Eastern (Druze)", "Middle Eastern (Bedouin)",

  // Hispanic/Latino
  "Hispanic (Mexican)", "Hispanic (Spanish)", "Hispanic (Colombian)", "Hispanic (Argentinian)",
  "Hispanic (Chilean)", "Hispanic (Peruvian)", "Hispanic (Cuban)", "Hispanic (Venezuelan)",
  "Hispanic (Dominican)", "Hispanic (Puerto Rican)", "Hispanic (Ecuadorian)", "Hispanic (Guatemalan)",
  "Hispanic (Bolivian)", "Hispanic (Uruguayan)", "Hispanic (Paraguayan)", "Hispanic (Honduran)",
  "Hispanic (Nicaraguan)", "Hispanic (Salvadoran)",

  // European
  "European (British)", "European (French)", "European (German)", "European (Italian)",
  "European (Spanish)", "European (Portuguese)", "European (Dutch)", "European (Swiss)",
  "European (Belgian)", "European (Austrian)", "European (Scandinavian - Swedish)",
  "European (Scandinavian - Norwegian)", "European (Scandinavian - Danish)", "European (Finnish)",
  "European (Icelandic)", "European (Eastern European - Polish)", "European (Eastern European - Russian)",
  "European (Eastern European - Ukrainian)", "European (Eastern European - Bulgarian)",
  "European (Eastern European - Romanian)", "European (Eastern European - Serbian)",
  "European (Hungarian)", "European (Greek)", "European (Irish)", "European (Scottish)",
  "European (Welsh)",

  // African
  "African (Nigerian - Yoruba)", "African (Nigerian - Igbo)", "African (Nigerian - Hausa)",
  "African (Ghanaian - Akan)", "African (Kenyan - Kikuyu)", "African (Kenyan - Luo)",
  "African (Ethiopian - Amhara)", "African (Ethiopian - Oromo)", "African (South African - Zulu)",
  "African (South African - Xhosa)", "African (Somali)", "African (Moroccan - Berber)",
  "African (Egyptian - Coptic)", "African (Tunisian)", "African (Algerian)", "African (Sudanese - Nubian)",
  "African (Rwandan - Tutsi)", "African (Congolese)",

  // Jewish
  "Jewish (Ashkenazi)", "Jewish (Sephardic)", "Jewish (Mizrahi)",

  // Pacific Islander
  "Pacific Islander (Hawaiian)", "Pacific Islander (Samoan)", "Pacific Islander (Tongan)",
  "Pacific Islander (Fijian)", "Pacific Islander (Papuan)",

  // Indigenous
  "Indigenous (Native American)", "Indigenous (Inuit)", "Indigenous (Maori)",
  "Indigenous (Aboriginal Australian)", "Indigenous (Ainu - Japan)",

  // Central Asian
  "Central Asian (Kazakh)", "Central Asian (Uzbek)", "Central Asian (Turkmen)",
  "Central Asian (Tajik)", "Central Asian (Kyrgyz)",

  // Caribbean
  "Caribbean (Jamaican)", "Caribbean (Haitian)", "Caribbean (Trinidadian)", "Caribbean (Barbadian)",

  // Other
  "African American", "Brazilian (Portuguese-speaking)", "Canadian (French-speaking)",
  "Australian (Anglo-Saxon)"

];
const RELIGIONS = [
   "African Traditional & Diasporic", "Agnostic", "Atheist", "Baha'i",
  "Buddhism", "Cao Dai", "Chinese traditional religion", "Christianity", "Hinduism",
  "Islam", "Jainism", "Juche", "Judaism", "Neo-Paganism", "Nonreligious", "Rastafarianism",
  "Secular", "Shinto", "Sikhism", "Spiritism", "Tenrikyo", "Unitarian-Universalism",
  "Zoroastrianism", "primal-indigenous"
];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kosovo", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand",
  "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America",
  "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];


const GENDER = ["Male", "Female", "Other"];

export {ETHNICITIES, RELIGIONS, COUNTRIES, GENDER};


