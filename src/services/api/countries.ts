/**
 * Service pour gérer les pays
 */

export interface Country {
  code: string
  name: string
  flag: string
  phone_code: string
}

export interface CountriesResponse {
  success: boolean
  data: Country[]
  message: string
}

/**
 * Service pour les pays
 */
class CountriesService {
  private baseUrl = '/api/v1'

  /**
   * Récupérer tous les pays
   */
  async getAllCountries(): Promise<Country[]> {
    // Utiliser directement les données locales pour éviter l'erreur 404
    return this.getLocalCountries()
  }

  /**
   * Récupérer les pays depuis les données locales
   */
  private getLocalCountries(): Country[] {
    return [
      { code: 'AD', name: 'Andorre', flag: '🇦🇩', phone_code: '+376' },
      { code: 'AE', name: 'Émirats arabes unis', flag: '🇦🇪', phone_code: '+971' },
      { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', phone_code: '+93' },
      { code: 'AG', name: 'Antigua-et-Barbuda', flag: '🇦🇬', phone_code: '+1268' },
      { code: 'AI', name: 'Anguilla', flag: '🇦🇮', phone_code: '+1264' },
      { code: 'AL', name: 'Albanie', flag: '🇦🇱', phone_code: '+355' },
      { code: 'AM', name: 'Arménie', flag: '🇦🇲', phone_code: '+374' },
      { code: 'AO', name: 'Angola', flag: '🇦🇴', phone_code: '+244' },
      { code: 'AQ', name: 'Antarctique', flag: '🇦🇶', phone_code: '+672' },
      { code: 'AR', name: 'Argentine', flag: '🇦🇷', phone_code: '+54' },
      { code: 'AS', name: 'Samoa américaines', flag: '🇦🇸', phone_code: '+1684' },
      { code: 'AT', name: 'Autriche', flag: '🇦🇹', phone_code: '+43' },
      { code: 'AU', name: 'Australie', flag: '🇦🇺', phone_code: '+61' },
      { code: 'AW', name: 'Aruba', flag: '🇦🇼', phone_code: '+297' },
      { code: 'AX', name: 'Îles Åland', flag: '🇦🇽', phone_code: '+358' },
      { code: 'AZ', name: 'Azerbaïdjan', flag: '🇦🇿', phone_code: '+994' },
      { code: 'BA', name: 'Bosnie-Herzégovine', flag: '🇧🇦', phone_code: '+387' },
      { code: 'BB', name: 'Barbade', flag: '🇧🇧', phone_code: '+1246' },
      { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', phone_code: '+880' },
      { code: 'BE', name: 'Belgique', flag: '🇧🇪', phone_code: '+32' },
      { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', phone_code: '+226' },
      { code: 'BG', name: 'Bulgarie', flag: '🇧🇬', phone_code: '+359' },
      { code: 'BH', name: 'Bahreïn', flag: '🇧🇭', phone_code: '+973' },
      { code: 'BI', name: 'Burundi', flag: '🇧🇮', phone_code: '+257' },
      { code: 'BJ', name: 'Bénin', flag: '🇧🇯', phone_code: '+229' },
      { code: 'BL', name: 'Saint-Barthélemy', flag: '🇧🇱', phone_code: '+590' },
      { code: 'BM', name: 'Bermudes', flag: '🇧🇲', phone_code: '+1441' },
      { code: 'BN', name: 'Brunei', flag: '🇧🇳', phone_code: '+673' },
      { code: 'BO', name: 'Bolivie', flag: '🇧🇴', phone_code: '+591' },
      { code: 'BQ', name: 'Pays-Bas caribéens', flag: '🇧🇶', phone_code: '+599' },
      { code: 'BR', name: 'Brésil', flag: '🇧🇷', phone_code: '+55' },
      { code: 'BS', name: 'Bahamas', flag: '🇧🇸', phone_code: '+1242' },
      { code: 'BT', name: 'Bhoutan', flag: '🇧🇹', phone_code: '+975' },
      { code: 'BV', name: 'Île Bouvet', flag: '🇧🇻', phone_code: '+47' },
      { code: 'BW', name: 'Botswana', flag: '🇧🇼', phone_code: '+267' },
      { code: 'BY', name: 'Biélorussie', flag: '🇧🇾', phone_code: '+375' },
      { code: 'BZ', name: 'Belize', flag: '🇧🇿', phone_code: '+501' },
      { code: 'CA', name: 'Canada', flag: '🇨🇦', phone_code: '+1' },
      { code: 'CC', name: 'Îles Cocos', flag: '🇨🇨', phone_code: '+61' },
      { code: 'CD', name: 'République démocratique du Congo', flag: '🇨🇩', phone_code: '+243' },
      { code: 'CF', name: 'République centrafricaine', flag: '🇨🇫', phone_code: '+236' },
      { code: 'CG', name: 'République du Congo', flag: '🇨🇬', phone_code: '+242' },
      { code: 'CH', name: 'Suisse', flag: '🇨🇭', phone_code: '+41' },
      { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', phone_code: '+225' },
      { code: 'CK', name: 'Îles Cook', flag: '🇨🇰', phone_code: '+682' },
      { code: 'CL', name: 'Chili', flag: '🇨🇱', phone_code: '+56' },
      { code: 'CM', name: 'Cameroun', flag: '🇨🇲', phone_code: '+237' },
      { code: 'CN', name: 'Chine', flag: '🇨🇳', phone_code: '+86' },
      { code: 'CO', name: 'Colombie', flag: '🇨🇴', phone_code: '+57' },
      { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', phone_code: '+506' },
      { code: 'CU', name: 'Cuba', flag: '🇨🇺', phone_code: '+53' },
      { code: 'CV', name: 'Cap-Vert', flag: '🇨🇻', phone_code: '+238' },
      { code: 'CW', name: 'Curaçao', flag: '🇨🇼', phone_code: '+599' },
      { code: 'CX', name: 'Île Christmas', flag: '🇨🇽', phone_code: '+61' },
      { code: 'CY', name: 'Chypre', flag: '🇨🇾', phone_code: '+357' },
      { code: 'CZ', name: 'République tchèque', flag: '🇨🇿', phone_code: '+420' },
      { code: 'DE', name: 'Allemagne', flag: '🇩🇪', phone_code: '+49' },
      { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', phone_code: '+253' },
      { code: 'DK', name: 'Danemark', flag: '🇩🇰', phone_code: '+45' },
      { code: 'DM', name: 'Dominique', flag: '🇩🇲', phone_code: '+1767' },
      { code: 'DO', name: 'République dominicaine', flag: '🇩🇴', phone_code: '+1809' },
      { code: 'DZ', name: 'Algérie', flag: '🇩🇿', phone_code: '+213' },
      { code: 'EC', name: 'Équateur', flag: '🇪🇨', phone_code: '+593' },
      { code: 'EE', name: 'Estonie', flag: '🇪🇪', phone_code: '+372' },
      { code: 'EG', name: 'Égypte', flag: '🇪🇬', phone_code: '+20' },
      { code: 'EH', name: 'Sahara occidental', flag: '🇪🇭', phone_code: '+212' },
      { code: 'ER', name: 'Érythrée', flag: '🇪🇷', phone_code: '+291' },
      { code: 'ES', name: 'Espagne', flag: '🇪🇸', phone_code: '+34' },
      { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', phone_code: '+251' },
      { code: 'FI', name: 'Finlande', flag: '🇫🇮', phone_code: '+358' },
      { code: 'FJ', name: 'Fidji', flag: '🇫🇯', phone_code: '+679' },
      { code: 'FK', name: 'Îles Malouines', flag: '🇫🇰', phone_code: '+500' },
      { code: 'FM', name: 'Micronésie', flag: '🇫🇲', phone_code: '+691' },
      { code: 'FO', name: 'Îles Féroé', flag: '🇫🇴', phone_code: '+298' },
      { code: 'FR', name: 'France', flag: '🇫🇷', phone_code: '+33' },
      { code: 'GA', name: 'Gabon', flag: '🇬🇦', phone_code: '+241' },
      { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', phone_code: '+44' },
      { code: 'GD', name: 'Grenade', flag: '🇬🇩', phone_code: '+1473' },
      { code: 'GE', name: 'Géorgie', flag: '🇬🇪', phone_code: '+995' },
      { code: 'GF', name: 'Guyane française', flag: '🇬🇫', phone_code: '+594' },
      { code: 'GG', name: 'Guernesey', flag: '🇬🇬', phone_code: '+44' },
      { code: 'GH', name: 'Ghana', flag: '🇬🇭', phone_code: '+233' },
      { code: 'GI', name: 'Gibraltar', flag: '🇬🇮', phone_code: '+350' },
      { code: 'GL', name: 'Groenland', flag: '🇬🇱', phone_code: '+299' },
      { code: 'GM', name: 'Gambie', flag: '🇬🇲', phone_code: '+220' },
      { code: 'GN', name: 'Guinée', flag: '🇬🇳', phone_code: '+224' },
      { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵', phone_code: '+590' },
      { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶', phone_code: '+240' },
      { code: 'GR', name: 'Grèce', flag: '🇬🇷', phone_code: '+30' },
      { code: 'GS', name: 'Géorgie du Sud-et-les Îles Sandwich du Sud', flag: '🇬🇸', phone_code: '+500' },
      { code: 'GT', name: 'Guatemala', flag: '🇬🇹', phone_code: '+502' },
      { code: 'GU', name: 'Guam', flag: '🇬🇺', phone_code: '+1671' },
      { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', phone_code: '+245' },
      { code: 'GY', name: 'Guyana', flag: '🇬🇾', phone_code: '+592' },
      { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', phone_code: '+852' },
      { code: 'HM', name: 'Île Heard et Îles McDonald', flag: '🇭🇲', phone_code: '+672' },
      { code: 'HN', name: 'Honduras', flag: '🇭🇳', phone_code: '+504' },
      { code: 'HR', name: 'Croatie', flag: '🇭🇷', phone_code: '+385' },
      { code: 'HT', name: 'Haïti', flag: '🇭🇹', phone_code: '+509' },
      { code: 'HU', name: 'Hongrie', flag: '🇭🇺', phone_code: '+36' },
      { code: 'ID', name: 'Indonésie', flag: '🇮🇩', phone_code: '+62' },
      { code: 'IE', name: 'Irlande', flag: '🇮🇪', phone_code: '+353' },
      { code: 'IL', name: 'Israël', flag: '🇮🇱', phone_code: '+972' },
      { code: 'IM', name: 'Île de Man', flag: '🇮🇲', phone_code: '+44' },
      { code: 'IN', name: 'Inde', flag: '🇮🇳', phone_code: '+91' },
      { code: 'IO', name: 'Territoire britannique de l\'océan Indien', flag: '🇮🇴', phone_code: '+246' },
      { code: 'IQ', name: 'Irak', flag: '🇮🇶', phone_code: '+964' },
      { code: 'IR', name: 'Iran', flag: '🇮🇷', phone_code: '+98' },
      { code: 'IS', name: 'Islande', flag: '🇮🇸', phone_code: '+354' },
      { code: 'IT', name: 'Italie', flag: '🇮🇹', phone_code: '+39' },
      { code: 'JE', name: 'Jersey', flag: '🇯🇪', phone_code: '+44' },
      { code: 'JM', name: 'Jamaïque', flag: '🇯🇲', phone_code: '+1876' },
      { code: 'JO', name: 'Jordanie', flag: '🇯🇴', phone_code: '+962' },
      { code: 'JP', name: 'Japon', flag: '🇯🇵', phone_code: '+81' },
      { code: 'KE', name: 'Kenya', flag: '🇰🇪', phone_code: '+254' },
      { code: 'KG', name: 'Kirghizistan', flag: '🇰🇬', phone_code: '+996' },
      { code: 'KH', name: 'Cambodge', flag: '🇰🇭', phone_code: '+855' },
      { code: 'KI', name: 'Kiribati', flag: '🇰🇮', phone_code: '+686' },
      { code: 'KM', name: 'Comores', flag: '🇰🇲', phone_code: '+269' },
      { code: 'KN', name: 'Saint-Kitts-et-Nevis', flag: '🇰🇳', phone_code: '+1869' },
      { code: 'KP', name: 'Corée du Nord', flag: '🇰🇵', phone_code: '+850' },
      { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷', phone_code: '+82' },
      { code: 'KW', name: 'Koweït', flag: '🇰🇼', phone_code: '+965' },
      { code: 'KY', name: 'Îles Caïmans', flag: '🇰🇾', phone_code: '+1345' },
      { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', phone_code: '+7' },
      { code: 'LA', name: 'Laos', flag: '🇱🇦', phone_code: '+856' },
      { code: 'LB', name: 'Liban', flag: '🇱🇧', phone_code: '+961' },
      { code: 'LC', name: 'Sainte-Lucie', flag: '🇱🇨', phone_code: '+1758' },
      { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', phone_code: '+423' },
      { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', phone_code: '+94' },
      { code: 'LR', name: 'Libéria', flag: '🇱🇷', phone_code: '+231' },
      { code: 'LS', name: 'Lesotho', flag: '🇱🇸', phone_code: '+266' },
      { code: 'LT', name: 'Lituanie', flag: '🇱🇹', phone_code: '+370' },
      { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', phone_code: '+352' },
      { code: 'LV', name: 'Lettonie', flag: '🇱🇻', phone_code: '+371' },
      { code: 'LY', name: 'Libye', flag: '🇱🇾', phone_code: '+218' },
      { code: 'MA', name: 'Maroc', flag: '🇲🇦', phone_code: '+212' },
      { code: 'MC', name: 'Monaco', flag: '🇲🇨', phone_code: '+377' },
      { code: 'MD', name: 'Moldavie', flag: '🇲🇩', phone_code: '+373' },
      { code: 'ME', name: 'Monténégro', flag: '🇲🇪', phone_code: '+382' },
      { code: 'MF', name: 'Saint-Martin', flag: '🇲🇫', phone_code: '+590' },
      { code: 'MG', name: 'Madagascar', flag: '🇲🇬', phone_code: '+261' },
      { code: 'MH', name: 'Îles Marshall', flag: '🇲🇭', phone_code: '+692' },
      { code: 'MK', name: 'Macédoine du Nord', flag: '🇲🇰', phone_code: '+389' },
      { code: 'ML', name: 'Mali', flag: '🇲🇱', phone_code: '+223' },
      { code: 'MM', name: 'Myanmar', flag: '🇲🇲', phone_code: '+95' },
      { code: 'MN', name: 'Mongolie', flag: '🇲🇳', phone_code: '+976' },
      { code: 'MO', name: 'Macao', flag: '🇲🇴', phone_code: '+853' },
      { code: 'MP', name: 'Îles Mariannes du Nord', flag: '🇲🇵', phone_code: '+1670' },
      { code: 'MQ', name: 'Martinique', flag: '🇲🇶', phone_code: '+596' },
      { code: 'MR', name: 'Mauritanie', flag: '🇲🇷', phone_code: '+222' },
      { code: 'MS', name: 'Montserrat', flag: '🇲🇸', phone_code: '+1664' },
      { code: 'MT', name: 'Malte', flag: '🇲🇹', phone_code: '+356' },
      { code: 'MU', name: 'Maurice', flag: '🇲🇺', phone_code: '+230' },
      { code: 'MV', name: 'Maldives', flag: '🇲🇻', phone_code: '+960' },
      { code: 'MW', name: 'Malawi', flag: '🇲🇼', phone_code: '+265' },
      { code: 'MX', name: 'Mexique', flag: '🇲🇽', phone_code: '+52' },
      { code: 'MY', name: 'Malaisie', flag: '🇲🇾', phone_code: '+60' },
      { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', phone_code: '+258' },
      { code: 'NA', name: 'Namibie', flag: '🇳🇦', phone_code: '+264' },
      { code: 'NC', name: 'Nouvelle-Calédonie', flag: '🇳🇨', phone_code: '+687' },
      { code: 'NE', name: 'Niger', flag: '🇳🇪', phone_code: '+227' },
      { code: 'NF', name: 'Île Norfolk', flag: '🇳🇫', phone_code: '+672' },
      { code: 'NG', name: 'Nigeria', flag: '🇳🇬', phone_code: '+234' },
      { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', phone_code: '+505' },
      { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', phone_code: '+31' },
      { code: 'NO', name: 'Norvège', flag: '🇳🇴', phone_code: '+47' },
      { code: 'NP', name: 'Népal', flag: '🇳🇵', phone_code: '+977' },
      { code: 'NR', name: 'Nauru', flag: '🇳🇷', phone_code: '+674' },
      { code: 'NU', name: 'Niue', flag: '🇳🇺', phone_code: '+683' },
      { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿', phone_code: '+64' },
      { code: 'OM', name: 'Oman', flag: '🇴🇲', phone_code: '+968' },
      { code: 'PA', name: 'Panama', flag: '🇵🇦', phone_code: '+507' },
      { code: 'PE', name: 'Pérou', flag: '🇵🇪', phone_code: '+51' },
      { code: 'PF', name: 'Polynésie française', flag: '🇵🇫', phone_code: '+689' },
      { code: 'PG', name: 'Papouasie-Nouvelle-Guinée', flag: '🇵🇬', phone_code: '+675' },
      { code: 'PH', name: 'Philippines', flag: '🇵🇭', phone_code: '+63' },
      { code: 'PK', name: 'Pakistan', flag: '🇵🇰', phone_code: '+92' },
      { code: 'PL', name: 'Pologne', flag: '🇵🇱', phone_code: '+48' },
      { code: 'PM', name: 'Saint-Pierre-et-Miquelon', flag: '🇵🇲', phone_code: '+508' },
      { code: 'PN', name: 'Pitcairn', flag: '🇵🇳', phone_code: '+64' },
      { code: 'PR', name: 'Porto Rico', flag: '🇵🇷', phone_code: '+1787' },
      { code: 'PS', name: 'Palestine', flag: '🇵🇸', phone_code: '+970' },
      { code: 'PT', name: 'Portugal', flag: '🇵🇹', phone_code: '+351' },
      { code: 'PW', name: 'Palaos', flag: '🇵🇼', phone_code: '+680' },
      { code: 'PY', name: 'Paraguay', flag: '🇵🇾', phone_code: '+595' },
      { code: 'QA', name: 'Qatar', flag: '🇶🇦', phone_code: '+974' },
      { code: 'RE', name: 'Réunion', flag: '🇷🇪', phone_code: '+262' },
      { code: 'RO', name: 'Roumanie', flag: '🇷🇴', phone_code: '+40' },
      { code: 'RS', name: 'Serbie', flag: '🇷🇸', phone_code: '+381' },
      { code: 'RU', name: 'Russie', flag: '🇷🇺', phone_code: '+7' },
      { code: 'RW', name: 'Rwanda', flag: '🇷🇼', phone_code: '+250' },
      { code: 'SA', name: 'Arabie saoudite', flag: '🇸🇦', phone_code: '+966' },
      { code: 'SB', name: 'Îles Salomon', flag: '🇸🇧', phone_code: '+677' },
      { code: 'SC', name: 'Seychelles', flag: '🇸🇨', phone_code: '+248' },
      { code: 'SD', name: 'Soudan', flag: '🇸🇩', phone_code: '+249' },
      { code: 'SE', name: 'Suède', flag: '🇸🇪', phone_code: '+46' },
      { code: 'SG', name: 'Singapour', flag: '🇸🇬', phone_code: '+65' },
      { code: 'SH', name: 'Sainte-Hélène', flag: '🇸🇭', phone_code: '+290' },
      { code: 'SI', name: 'Slovénie', flag: '🇸🇮', phone_code: '+386' },
      { code: 'SJ', name: 'Svalbard et Jan Mayen', flag: '🇸🇯', phone_code: '+47' },
      { code: 'SK', name: 'Slovaquie', flag: '🇸🇰', phone_code: '+421' },
      { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', phone_code: '+232' },
      { code: 'SM', name: 'Saint-Marin', flag: '🇸🇲', phone_code: '+378' },
      { code: 'SN', name: 'Sénégal', flag: '🇸🇳', phone_code: '+221' },
      { code: 'SO', name: 'Somalie', flag: '🇸🇴', phone_code: '+252' },
      { code: 'SR', name: 'Suriname', flag: '🇸🇷', phone_code: '+597' },
      { code: 'SS', name: 'Soudan du Sud', flag: '🇸🇸', phone_code: '+211' },
      { code: 'ST', name: 'São Tomé-et-Príncipe', flag: '🇸🇹', phone_code: '+239' },
      { code: 'SV', name: 'Salvador', flag: '🇸🇻', phone_code: '+503' },
      { code: 'SX', name: 'Sint Maarten', flag: '🇸🇽', phone_code: '+1721' },
      { code: 'SY', name: 'Syrie', flag: '🇸🇾', phone_code: '+963' },
      { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', phone_code: '+268' },
      { code: 'TC', name: 'Îles Turques-et-Caïques', flag: '🇹🇨', phone_code: '+1649' },
      { code: 'TD', name: 'Tchad', flag: '🇹🇩', phone_code: '+235' },
      { code: 'TF', name: 'Terres australes françaises', flag: '🇹🇫', phone_code: '+262' },
      { code: 'TG', name: 'Togo', flag: '🇹🇬', phone_code: '+228' },
      { code: 'TH', name: 'Thaïlande', flag: '🇹🇭', phone_code: '+66' },
      { code: 'TJ', name: 'Tadjikistan', flag: '🇹🇯', phone_code: '+992' },
      { code: 'TK', name: 'Tokelau', flag: '🇹🇰', phone_code: '+690' },
      { code: 'TL', name: 'Timor oriental', flag: '🇹🇱', phone_code: '+670' },
      { code: 'TM', name: 'Turkménistan', flag: '🇹🇲', phone_code: '+993' },
      { code: 'TN', name: 'Tunisie', flag: '🇹🇳', phone_code: '+216' },
      { code: 'TO', name: 'Tonga', flag: '🇹🇴', phone_code: '+676' },
      { code: 'TR', name: 'Turquie', flag: '🇹🇷', phone_code: '+90' },
      { code: 'TT', name: 'Trinité-et-Tobago', flag: '🇹🇹', phone_code: '+1868' },
      { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', phone_code: '+688' },
      { code: 'TW', name: 'Taïwan', flag: '🇹🇼', phone_code: '+886' },
      { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', phone_code: '+255' },
      { code: 'UA', name: 'Ukraine', flag: '🇺🇦', phone_code: '+380' },
      { code: 'UG', name: 'Ouganda', flag: '🇺🇬', phone_code: '+256' },
      { code: 'UM', name: 'Îles mineures éloignées des États-Unis', flag: '🇺🇲', phone_code: '+1' },
      { code: 'US', name: 'États-Unis', flag: '🇺🇸', phone_code: '+1' },
      { code: 'UY', name: 'Uruguay', flag: '🇺🇾', phone_code: '+598' },
      { code: 'UZ', name: 'Ouzbékistan', flag: '🇺🇿', phone_code: '+998' },
      { code: 'VA', name: 'Vatican', flag: '🇻🇦', phone_code: '+379' },
      { code: 'VC', name: 'Saint-Vincent-et-les-Grenadines', flag: '🇻🇨', phone_code: '+1784' },
      { code: 'VE', name: 'Venezuela', flag: '🇻🇪', phone_code: '+58' },
      { code: 'VG', name: 'Îles Vierges britanniques', flag: '🇻🇬', phone_code: '+1284' },
      { code: 'VI', name: 'Îles Vierges des États-Unis', flag: '🇻🇮', phone_code: '+1340' },
      { code: 'VN', name: 'Vietnam', flag: '🇻🇳', phone_code: '+84' },
      { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', phone_code: '+678' },
      { code: 'WF', name: 'Wallis-et-Futuna', flag: '🇼🇫', phone_code: '+681' },
      { code: 'WS', name: 'Samoa', flag: '🇼🇸', phone_code: '+685' },
      { code: 'YE', name: 'Yémen', flag: '🇾🇪', phone_code: '+967' },
      { code: 'YT', name: 'Mayotte', flag: '🇾🇹', phone_code: '+262' },
      { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', phone_code: '+27' },
      { code: 'ZM', name: 'Zambie', flag: '🇿🇲', phone_code: '+260' },
      { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', phone_code: '+263' }
    ]
  }

  /**
   * Rechercher des pays par nom
   */
  async searchCountries(query: string): Promise<Country[]> {
    const countries = await this.getAllCountries()
    const lowercaseQuery = query.toLowerCase()
    
    return countries.filter(country => 
      country.name.toLowerCase().includes(lowercaseQuery) ||
      country.code.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Obtenir un pays par son code
   */
  async getCountryByCode(code: string): Promise<Country | null> {
    const countries = await this.getAllCountries()
    return countries.find(country => country.code === code) || null
  }
}

export const countriesService = new CountriesService()
