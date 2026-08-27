export interface BDDivision {
  id: string;
  name: string;
  bnName: string;
}

export interface BDDistrict {
  id: string;
  divisionId: string;
  name: string;
  bnName: string;
  popularAreas?: string[];
  postalCode?: string;
}

export const BANGLADESH_DIVISIONS: BDDivision[] = [
  { id: 'dhaka', name: 'Dhaka', bnName: 'ঢাকা' },
  { id: 'chattogram', name: 'Chattogram', bnName: 'চট্টগ্রাম' },
  { id: 'rajshahi', name: 'Rajshahi', bnName: 'রাজশাহী' },
  { id: 'khulna', name: 'Khulna', bnName: 'খুলনা' },
  { id: 'barishal', name: 'Barishal', bnName: 'বরিশাল' },
  { id: 'sylhet', name: 'Sylhet', bnName: 'সিলেট' },
  { id: 'rangpur', name: 'Rangpur', bnName: 'রংপুর' },
  { id: 'mymensingh', name: 'Mymensingh', bnName: 'ময়মনসিংহ' },
];

export const BANGLADESH_DISTRICTS: BDDistrict[] = [
  // 1. Dhaka Division (13 Districts)
  {
    id: 'dhaka',
    divisionId: 'dhaka',
    name: 'Dhaka',
    bnName: 'ঢাকা',
    postalCode: '1200',
    popularAreas: [
      'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur',
      'Badda', 'Motijheel', 'Old Dhaka / Lalbagh', 'Bashundhara R/A',
      'Khilgaon', 'Jatrabari', 'Malibagh', 'Tejgaon', 'Savar', 'Keraniganj', 'Dhamrai',
    ],
  },
  {
    id: 'gazipur',
    divisionId: 'dhaka',
    name: 'Gazipur',
    bnName: 'গাজীপুর',
    postalCode: '1700',
    popularAreas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj', 'Board Bazar', 'Chowrasta'],
  },
  {
    id: 'narayanganj',
    divisionId: 'dhaka',
    name: 'Narayanganj',
    bnName: 'নারায়ণগঞ্জ',
    postalCode: '1400',
    popularAreas: ['Narayanganj Sadar', 'Fatullah', 'Siddhirganj', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar', 'Chashara'],
  },
  {
    id: 'tangail',
    divisionId: 'dhaka',
    name: 'Tangail',
    bnName: 'টাঙ্গাইল',
    postalCode: '1900',
    popularAreas: ['Tangail Sadar', 'Mirzapur', 'Gopalpur', 'Ghatail', 'Madhupur', 'Kalihati', 'Sakhipur', 'Nagarpur', 'Bhuapur'],
  },
  {
    id: 'narsingdi',
    divisionId: 'dhaka',
    name: 'Narsingdi',
    bnName: 'নরসিংদী',
    postalCode: '1600',
    popularAreas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Belabo', 'Monohardi', 'Raipura', 'Madhabdi'],
  },
  {
    id: 'faridpur',
    divisionId: 'dhaka',
    name: 'Faridpur',
    bnName: 'ফরিদপুর',
    postalCode: '7800',
    popularAreas: ['Faridpur Sadar', 'Boalmari', 'Bhanga', 'Alfadanga', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
  },
  {
    id: 'manikganj',
    divisionId: 'dhaka',
    name: 'Manikganj',
    bnName: 'মানিকগঞ্জ',
    postalCode: '1800',
    popularAreas: ['Manikganj Sadar', 'Singair', 'Shibalaya', 'Saturia', 'Harirampur', 'Ghior', 'Daulatpur'],
  },
  {
    id: 'munshiganj',
    divisionId: 'dhaka',
    name: 'Munshiganj',
    bnName: 'মুন্সীগঞ্জ',
    postalCode: '1500',
    popularAreas: ['Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Lohajang', 'Tongibari', 'Gazaria'],
  },
  {
    id: 'kishoreganj',
    divisionId: 'dhaka',
    name: 'Kishoreganj',
    bnName: 'কিশোরগঞ্জ',
    postalCode: '2300',
    popularAreas: ['Kishoreganj Sadar', 'Bhairab', 'Bajitpur', 'Katiadi', 'Pakundia', 'Karimganj', 'Nikli', 'Austagram'],
  },
  {
    id: 'gopalganj',
    divisionId: 'dhaka',
    name: 'Gopalganj',
    bnName: 'গোপালগঞ্জ',
    postalCode: '8100',
    popularAreas: ['Gopalganj Sadar', 'Tungipara', 'Kotalipara', 'Kashiani', 'Muksudpur'],
  },
  {
    id: 'madaripur',
    divisionId: 'dhaka',
    name: 'Madaripur',
    bnName: 'মাদারীপুর',
    postalCode: '7900',
    popularAreas: ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir', 'Dasar'],
  },
  {
    id: 'rajbari',
    divisionId: 'dhaka',
    name: 'Rajbari',
    bnName: 'রাজবাড়ী',
    postalCode: '7700',
    popularAreas: ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali'],
  },
  {
    id: 'shariatpur',
    divisionId: 'dhaka',
    name: 'Shariatpur',
    bnName: 'শরীয়তপুর',
    postalCode: '8000',
    popularAreas: ['Shariatpur Sadar', 'Zajira', 'Naria', 'Damudya', 'Bhedarganj', 'Gosairhat'],
  },

  // 2. Chattogram Division (11 Districts)
  {
    id: 'chattogram',
    divisionId: 'chattogram',
    name: 'Chattogram',
    bnName: 'চট্টগ্রাম',
    postalCode: '4000',
    popularAreas: [
      'GEC Circle', 'Agrabad', 'Nasirabad', 'Panchlaish', 'Halishahar',
      'Kotwali', 'Khulshi', 'Chawkbazar', 'Pahartali', 'Bakalia', 'Sitakunda', 'Hathazari', 'Patiya', 'Raozan',
    ],
  },
  {
    id: 'coxs-bazar',
    divisionId: 'chattogram',
    name: "Cox's Bazar",
    bnName: 'কক্সবাজার',
    postalCode: '4700',
    popularAreas: ["Cox's Bazar Sadar", 'Kolatoli', 'Laboni Point', 'Teknaf', 'Ukhiya', 'Chakaria', 'Ramu', 'Maheshkhali', 'Pekua'],
  },
  {
    id: 'cumilla',
    divisionId: 'chattogram',
    name: 'Cumilla',
    bnName: 'কুমিল্লা',
    postalCode: '3500',
    popularAreas: ['Cumilla Adarsha Sadar', 'Kandirpar', 'Laksam', 'Daudkandi', 'Chandina', 'Burichang', 'Debidwar', 'Muradnagar', 'Chauddagram'],
  },
  {
    id: 'feni',
    divisionId: 'chattogram',
    name: 'Feni',
    bnName: 'ফেনী',
    postalCode: '3900',
    popularAreas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Sonagazi', 'Fulgazi', 'Grand Trunk Road'],
  },
  {
    id: 'brahmanbaria',
    divisionId: 'chattogram',
    name: 'Brahmanbaria',
    bnName: 'ব্রাহ্মণবাড়িয়া',
    postalCode: '3400',
    popularAreas: ['Brahmanbaria Sadar', 'Ashuganj', 'Sarail', 'Kasba', 'Nabinagar', 'Bancharampur', 'Akhaura', 'Nasirnagar'],
  },
  {
    id: 'noakhali',
    divisionId: 'chattogram',
    name: 'Noakhali',
    bnName: 'নোয়াখালী',
    postalCode: '3800',
    popularAreas: ['Noakhali Sadar (Maijdee)', 'Begumganj (Chowmuhani)', 'Senbagh', 'Sonaimuri', 'Chatkhil', 'Companiganj', 'Hatiya'],
  },
  {
    id: 'lakshmipur',
    divisionId: 'chattogram',
    name: 'Lakshmipur',
    bnName: 'লক্ষ্মীপুর',
    postalCode: '3700',
    popularAreas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
  },
  {
    id: 'chandpur',
    divisionId: 'chattogram',
    name: 'Chandpur',
    bnName: 'চাঁদপুর',
    postalCode: '3600',
    popularAreas: ['Chandpur Sadar', 'Hajiganj', 'Matlab North', 'Matlab South', 'Shahrasti', 'Faridganj', 'Kachua', 'Haimchar'],
  },
  {
    id: 'rangamati',
    divisionId: 'chattogram',
    name: 'Rangamati',
    bnName: 'রাঙ্গামাটি',
    postalCode: '4500',
    popularAreas: ['Rangamati Sadar', 'Kaptai', 'Baghaichhari', 'Barkal', 'Langadu', 'Rajasthali', 'Belaichhari'],
  },
  {
    id: 'bandarban',
    divisionId: 'chattogram',
    name: 'Bandarban',
    bnName: 'বান্দরবান',
    postalCode: '4600',
    popularAreas: ['Bandarban Sadar', 'Ruma', 'Thanchi', 'Lama', 'Alikadam', 'Rowangchhari', 'Naikhongchhari'],
  },
  {
    id: 'khagrachhari',
    divisionId: 'chattogram',
    name: 'Khagrachhari',
    bnName: 'খাগড়াছড়ি',
    postalCode: '4400',
    popularAreas: ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Matiranga', 'Manikchhari', 'Ramgarh', 'Guimara'],
  },

  // 3. Rajshahi Division (8 Districts)
  {
    id: 'rajshahi',
    divisionId: 'rajshahi',
    name: 'Rajshahi',
    bnName: 'রাজশাহী',
    postalCode: '6000',
    popularAreas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Paba', 'Godagari', 'Tanore', 'Bagha', 'Charghat', 'Durgapur', 'Puthia'],
  },
  {
    id: 'bogura',
    divisionId: 'rajshahi',
    name: 'Bogura',
    bnName: 'বগুড়া',
    postalCode: '5800',
    popularAreas: ['Bogura Sadar', 'Sheroopur', 'Shajahanpur', 'Gabtali', 'Shibganj', 'Dupchanchia', 'Kahaloo', 'Nandigram', 'Sonatala'],
  },
  {
    id: 'pabna',
    divisionId: 'rajshahi',
    name: 'Pabna',
    bnName: 'পাবনা',
    postalCode: '6600',
    popularAreas: ['Pabna Sadar', 'Ishwardi', 'Sujanagar', 'Santhia', 'Chatmohar', 'Bera', 'Faridpur', 'Atgharia', 'Bhangura'],
  },
  {
    id: 'sirajganj',
    divisionId: 'rajshahi',
    name: 'Sirajganj',
    bnName: 'সিরাজগঞ্জ',
    postalCode: '6700',
    popularAreas: ['Sirajganj Sadar', 'Shahjadpur', 'Ullapara', 'Belkuchi', 'Kazipur', 'Raiganj', 'Tarash', 'Kamarkhanda', 'Chauhali'],
  },
  {
    id: 'naogaon',
    divisionId: 'rajshahi',
    name: 'Naogaon',
    bnName: 'নওগাঁ',
    postalCode: '6500',
    popularAreas: ['Naogaon Sadar', 'Mohadevpur', 'Patnitala', 'Dhamoirhat', 'Manda', 'Niamatpur', 'Raninagar', 'Atrai', 'Badalgachhi'],
  },
  {
    id: 'natore',
    divisionId: 'rajshahi',
    name: 'Natore',
    bnName: 'নাটোর',
    postalCode: '6400',
    popularAreas: ['Natore Sadar', 'Singra', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Bagatipara', 'Naldanga'],
  },
  {
    id: 'chapainawabganj',
    divisionId: 'rajshahi',
    name: 'Chapainawabganj',
    bnName: 'চাঁপাইনবাবগঞ্জ',
    postalCode: '6300',
    popularAreas: ['Chapainawabganj Sadar', 'Shibganj', 'Gomostapur', 'Nachole', 'Bholahat'],
  },
  {
    id: 'joypurhat',
    divisionId: 'rajshahi',
    name: 'Joypurhat',
    bnName: 'জয়পুরহাট',
    postalCode: '5900',
    popularAreas: ['Joypurhat Sadar', 'Panchbibi', 'Kalai', 'Khetlal', 'Akkelpur'],
  },

  // 4. Khulna Division (10 Districts)
  {
    id: 'khulna',
    divisionId: 'khulna',
    name: 'Khulna',
    bnName: 'খুলনা',
    postalCode: '9000',
    popularAreas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Dumuria', 'Rupsha', 'Batiaghata', 'Phultala', 'Dighalia'],
  },
  {
    id: 'jashore',
    divisionId: 'khulna',
    name: 'Jashore',
    bnName: 'যশোর',
    postalCode: '7400',
    popularAreas: ['Jashore Sadar', 'Jhikargachha', 'Sharsha (Benapole)', 'Manirampur', 'Abhaynagar', 'Keshabpur', 'Bagherpara', 'Chaugachha'],
  },
  {
    id: 'kushtia',
    divisionId: 'khulna',
    name: 'Kushtia',
    bnName: 'কুষ্টিয়া',
    postalCode: '7000',
    popularAreas: ['Kushtia Sadar', 'Kumarkhali', 'Bheramara', 'Mirpur', 'Khoksa', 'Daulatpur'],
  },
  {
    id: 'satkhira',
    divisionId: 'khulna',
    name: 'Satkhira',
    bnName: 'সাতক্ষীরা',
    postalCode: '9400',
    popularAreas: ['Satkhira Sadar', 'Kalaroa', 'Tala', 'Kaliganj', 'Shyamnagar', 'Assasuni', 'Debhata'],
  },
  {
    id: 'bagerhat',
    divisionId: 'khulna',
    name: 'Bagerhat',
    bnName: 'বাগেরহাট',
    postalCode: '9300',
    popularAreas: ['Bagerhat Sadar', 'Mongla', 'Fakirhat', 'Rampal', 'Kachua', 'Morrelganj', 'Sarankhola', 'Mollahat', 'Chitalmari'],
  },
  {
    id: 'jhenaidah',
    divisionId: 'khulna',
    name: 'Jhenaidah',
    bnName: 'ঝিনাইদহ',
    postalCode: '7300',
    popularAreas: ['Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa', 'Harinakunda'],
  },
  {
    id: 'chuadanga',
    divisionId: 'khulna',
    name: 'Chuadanga',
    bnName: 'চুয়াডাঙ্গা',
    postalCode: '7200',
    popularAreas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar', 'Darshana'],
  },
  {
    id: 'magura',
    divisionId: 'khulna',
    name: 'Magura',
    bnName: 'মাগুরা',
    postalCode: '7600',
    popularAreas: ['Magura Sadar', 'Sreepur', 'Shalikha', 'Mohammadpur'],
  },
  {
    id: 'meherpur',
    divisionId: 'khulna',
    name: 'Meherpur',
    bnName: 'মেহেরপুর',
    postalCode: '7100',
    popularAreas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar'],
  },
  {
    id: 'narail',
    divisionId: 'khulna',
    name: 'Narail',
    bnName: 'নড়াইল',
    postalCode: '7500',
    popularAreas: ['Narail Sadar', 'Lohagara', 'Kalia'],
  },

  // 5. Barishal Division (6 Districts)
  {
    id: 'barishal',
    divisionId: 'barishal',
    name: 'Barishal',
    bnName: 'বরিশাল',
    postalCode: '8200',
    popularAreas: ['Barishal Sadar (Kotwali)', 'Bakerganj', 'Babuganj', 'Banaripara', 'Gournadi', 'Agailjhara', 'Mehendiganj', 'Muladi', 'Hizla', 'Wazirpur'],
  },
  {
    id: 'patuakhali',
    divisionId: 'barishal',
    name: 'Patuakhali',
    bnName: 'পটুয়াখালী',
    postalCode: '8600',
    popularAreas: ['Patuakhali Sadar', 'Kuakata', 'Galachipa', 'Kalapara', 'Bauphal', 'Dumki', 'Mirzaganj', 'Rangabali'],
  },
  {
    id: 'bhola',
    divisionId: 'barishal',
    name: 'Bhola',
    bnName: 'ভোলা',
    postalCode: '8300',
    popularAreas: ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Tazumuddin', 'Monpura'],
  },
  {
    id: 'pirojpur',
    divisionId: 'barishal',
    name: 'Pirojpur',
    bnName: 'পিরোজপুর',
    postalCode: '8500',
    popularAreas: ['Pirojpur Sadar', 'Mathbaria', 'Bhandaria', 'Nesarabad (Swarupkathi)', 'Kawkhali', 'Nazirpur', 'Zianagar (Indurkani)'],
  },
  {
    id: 'barguna',
    divisionId: 'barishal',
    name: 'Barguna',
    bnName: 'বরগুনা',
    postalCode: '8700',
    popularAreas: ['Barguna Sadar', 'Amtali', 'Patharghata', 'Betagi', 'Bamna', 'Taltali'],
  },
  {
    id: 'jhalokathi',
    divisionId: 'barishal',
    name: 'Jhalokathi',
    bnName: 'ঝালকাঠি',
    postalCode: '8400',
    popularAreas: ['Jhalokathi Sadar', 'Nalchity', 'Rajapur', 'Kathalia'],
  },

  // 6. Sylhet Division (4 Districts)
  {
    id: 'sylhet',
    divisionId: 'sylhet',
    name: 'Sylhet',
    bnName: 'সিলেট',
    postalCode: '3100',
    popularAreas: ['Kotwali', 'Zindabazar', 'Amberkhana', 'South Surma', 'Beanibazar', 'Golapganj', 'Biswanath', 'Zakiganj', 'Kanaighat', 'Jaintiapur', 'Gowainghat', 'Companiganj', 'Fenchuganj', 'Osmani Nagar'],
  },
  {
    id: 'moulvibazar',
    divisionId: 'sylhet',
    name: 'Moulvibazar',
    bnName: 'মৌলভীবাজার',
    postalCode: '3200',
    popularAreas: ['Moulvibazar Sadar', 'Sreemangal', 'Kulaura', 'Kamalganj', 'Barlekha', 'Rajnagar', 'Juri'],
  },
  {
    id: 'habiganj',
    divisionId: 'sylhet',
    name: 'Habiganj',
    bnName: 'হবিগঞ্জ',
    postalCode: '3300',
    popularAreas: ['Habiganj Sadar', 'Madhabpur', 'Nabiganj', 'Bahubal', 'Chunarughat', 'Baniachong', 'Ajmiriganj', 'Lakhai', 'Shayestaganj'],
  },
  {
    id: 'sunamganj',
    divisionId: 'sylhet',
    name: 'Sunamganj',
    bnName: 'সুনামগঞ্জ',
    postalCode: '3000',
    popularAreas: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Tahirpur', 'Derai', 'Dharampasha', 'Dowarabazar', 'Jamalganj', 'Shantiganj (South Sunamganj)', 'Sullah', 'Madhyanagar'],
  },

  // 7. Rangpur Division (8 Districts)
  {
    id: 'rangpur',
    divisionId: 'rangpur',
    name: 'Rangpur',
    bnName: 'রংপুর',
    postalCode: '5400',
    popularAreas: ['Rangpur Sadar', 'Kotwali', 'Mithapukur', 'Pirganj', 'Badarganj', 'Gangachhara', 'Kaunia', 'Pirgachha', 'Taraganj'],
  },
  {
    id: 'dinajpur',
    divisionId: 'rangpur',
    name: 'Dinajpur',
    bnName: 'দিনাজপুর',
    postalCode: '5200',
    popularAreas: ['Dinajpur Sadar', 'Birganj', 'Birampur', 'Biral', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur (Hili)', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'],
  },
  {
    id: 'gaibandha',
    divisionId: 'rangpur',
    name: 'Gaibandha',
    bnName: 'গাইবান্ধা',
    postalCode: '5700',
    popularAreas: ['Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Sundarganj', 'Saghata', 'Fulchhari'],
  },
  {
    id: 'kurigram',
    divisionId: 'rangpur',
    name: 'Kurigram',
    bnName: 'কুড়িগ্রাম',
    postalCode: '5600',
    popularAreas: ['Kurigram Sadar', 'Nageshwari', 'Bhurungamari', 'Ulipur', 'Chilmari', 'Rajarhat', 'Rowmari', 'Char Rajibpur', 'Phulbari'],
  },
  {
    id: 'lalmonirhat',
    divisionId: 'rangpur',
    name: 'Lalmonirhat',
    bnName: 'লালমনিরহাট',
    postalCode: '5500',
    popularAreas: ['Lalmonirhat Sadar', 'Aditmari', 'Kaliganj', 'Hatibandha', 'Patgram (Burimari)'],
  },
  {
    id: 'nilphamari',
    divisionId: 'rangpur',
    name: 'Nilphamari',
    bnName: 'নীলফামারী',
    postalCode: '5300',
    popularAreas: ['Nilphamari Sadar', 'Saidpur', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj Upazila'],
  },
  {
    id: 'panchagarh',
    divisionId: 'rangpur',
    name: 'Panchagarh',
    bnName: 'পঞ্চগড়',
    postalCode: '5000',
    popularAreas: ['Panchagarh Sadar', 'Tetulia (Banglabandha)', 'Boda', 'Debiganj', 'Atwari'],
  },
  {
    id: 'thakurgaon',
    divisionId: 'rangpur',
    name: 'Thakurgaon',
    bnName: 'ঠাকুরগাঁও',
    postalCode: '5100',
    popularAreas: ['Thakurgaon Sadar', 'Pirganj', 'Baliadangi', 'Ranisankail', 'Haripur'],
  },

  // 8. Mymensingh Division (4 Districts)
  {
    id: 'mymensingh',
    divisionId: 'mymensingh',
    name: 'Mymensingh',
    bnName: 'ময়মনসিংহ',
    postalCode: '2200',
    popularAreas: ['Mymensingh Sadar', 'Muktagachha', 'Trishal', 'Bhaluka', 'Fulbaria', 'Gafargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Nandail', 'Phulpur', 'Tara Khanda'],
  },
  {
    id: 'jamalpur',
    divisionId: 'mymensingh',
    name: 'Jamalpur',
    bnName: 'জামালপুর',
    postalCode: '2000',
    popularAreas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur', 'Dewanganj', 'Madarganj', 'Bakshiganj'],
  },
  {
    id: 'netrokona',
    divisionId: 'mymensingh',
    name: 'Netrokona',
    bnName: 'নেত্রকোণা',
    postalCode: '2400',
    popularAreas: ['Netrokona Sadar', 'Kendua', 'Durgapur', 'Mohanganj', 'Barhatta', 'Kalmakanda', 'Atpara', 'Purbadhala', 'Madan', 'Khaliajuri'],
  },
  {
    id: 'sherpur',
    divisionId: 'mymensingh',
    name: 'Sherpur',
    bnName: 'শেরপুর',
    postalCode: '2100',
    popularAreas: ['Sherpur Sadar', 'Nakla', 'Nalitabari', 'Jhenaigati', 'Sreebardi'],
  },
];

/**
 * Get districts by division identifier or division name (case-insensitive)
 */
export function getDistrictsByDivision(divisionKey: string): BDDistrict[] {
  if (!divisionKey || divisionKey.toLowerCase() === 'all') {
    return BANGLADESH_DISTRICTS;
  }
  const cleanKey = divisionKey.trim().toLowerCase();
  
  // Match by id or English name or Bengali name
  const division = BANGLADESH_DIVISIONS.find(
    (d) =>
      d.id.toLowerCase() === cleanKey ||
      d.name.toLowerCase() === cleanKey ||
      d.bnName === cleanKey
  );

  const targetDivId = division ? division.id : cleanKey;
  return BANGLADESH_DISTRICTS.filter(
    (d) => d.divisionId.toLowerCase() === targetDivId
  );
}

/**
 * Find district object by name (English or Bangla)
 */
export function findDistrictByName(districtName: string): BDDistrict | undefined {
  if (!districtName) return undefined;
  const clean = districtName.trim().toLowerCase();
  return BANGLADESH_DISTRICTS.find(
    (d) =>
      d.name.toLowerCase() === clean ||
      d.bnName.toLowerCase() === clean ||
      d.id.toLowerCase() === clean
  );
}

/**
 * Find division object by district name
 */
export function findDivisionByDistrict(districtName: string): BDDivision | undefined {
  const dist = findDistrictByName(districtName);
  if (!dist) return undefined;
  return BANGLADESH_DIVISIONS.find((div) => div.id === dist.divisionId);
}
