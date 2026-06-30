"use client";
import { useState, useEffect } from "react";
import { ToolCard, PrimaryButton, T } from "@/app/dashboard/lead-generation/_shell";
import { safeJson } from "@/lib/frontend/api";
import { SaveLeadButton } from "./SaveLeadButton";
import { INTL_COUNTRIES } from "./GlobalCompanies";

const inp = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", colorScheme: "dark",
};
const ghostBtn = {
  fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 10, cursor: "pointer",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.6)",
};


const INTL_COUNTRY_STATES = {
  "United States":   ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
  "United Kingdom":  ["England","Scotland","Wales","Northern Ireland"],
  "Australia":       ["New South Wales","Victoria","Queensland","Western Australia","South Australia","Tasmania","Australian Capital Territory","Northern Territory"],
  "Canada":          ["Ontario","British Columbia","Alberta","Quebec","Manitoba","Saskatchewan","Nova Scotia","New Brunswick","Newfoundland and Labrador","Prince Edward Island"],
  "Germany":         ["Bavaria","North Rhine-Westphalia","Baden-Württemberg","Lower Saxony","Hesse","Saxony","Berlin","Hamburg","Rhineland-Palatinate","Schleswig-Holstein","Brandenburg","Saxony-Anhalt","Thuringia","Bremen","Mecklenburg-Vorpommern","Saarland"],
  "France":          ["Île-de-France","Auvergne-Rhône-Alpes","Occitanie","Nouvelle-Aquitaine","Hauts-de-France","Provence-Alpes-Côte d'Azur","Grand Est","Pays de la Loire","Normandie","Bretagne","Bourgogne-Franche-Comté","Centre-Val de Loire","Corse"],
  "Brazil":          ["São Paulo","Rio de Janeiro","Minas Gerais","Bahia","Paraná","Rio Grande do Sul","Pernambuco","Ceará","Pará","Goiás","Amazonas","Santa Catarina","Maranhão","Mato Grosso","Espírito Santo","Paraíba","Rio Grande do Norte","Alagoas","Piauí","Mato Grosso do Sul","Tocantins","Rondônia","Acre","Amapá","Roraima","Sergipe","Distrito Federal"],
  "Mexico":          ["Mexico City","Jalisco","Nuevo León","State of Mexico","Puebla","Guanajuato","Chihuahua","Baja California","Veracruz","Sonora","Tamaulipas","Sinaloa","Coahuila","Oaxaca","Tabasco","Guerrero","Querétaro","Yucatán","Michoacán","San Luis Potosí","Quintana Roo","Hidalgo","Aguascalientes","Morelos","Tlaxcala","Durango","Zacatecas","Chiapas","Campeche","Colima","Nayarit","Baja California Sur"],
  "China":           ["Beijing","Shanghai","Tianjin","Chongqing","Guangdong","Shandong","Jiangsu","Zhejiang","Henan","Sichuan","Hebei","Hubei","Hunan","Fujian","Anhui","Liaoning","Jilin","Heilongjiang","Shanxi","Shaanxi","Jiangxi","Yunnan","Guizhou","Gansu","Inner Mongolia","Xinjiang","Tibet","Guangxi","Hainan","Ningxia","Qinghai"],
  "Japan":           ["Tokyo","Osaka","Kanagawa","Aichi","Saitama","Chiba","Hyogo","Hokkaido","Fukuoka","Shizuoka","Ibaraki","Hiroshima","Kyoto","Miyagi","Niigata","Nagano","Tochigi","Gunma","Okayama","Fukushima","Mie","Kumamoto","Kagoshima","Yamaguchi","Ehime","Nara","Okinawa","Shiga","Gifu","Tokushima","Wakayama","Kochi","Saga","Yamanashi","Toyama","Akita","Aomori","Iwate","Nagasaki","Oita","Miyazaki","Shimane","Tottori","Fukui","Ishikawa","Yamagata","Kagawa","Tokushima"],
  "South Korea":     ["Seoul","Gyeonggi","Incheon","Busan","Daegu","Daejeon","Gwangju","Ulsan","Sejong","Gangwon","North Chungcheong","South Chungcheong","North Jeolla","South Jeolla","North Gyeongsang","South Gyeongsang","Jeju"],
  "Indonesia":       ["Jakarta","West Java","Central Java","East Java","Banten","Bali","North Sumatra","South Sumatra","West Sumatra","Riau","Lampung","South Sulawesi","North Sulawesi","West Kalimantan","South Kalimantan","East Kalimantan","Papua","West Papua","Maluku","North Maluku","Yogyakarta","Aceh"],
  "Malaysia":        ["Kuala Lumpur","Selangor","Johor","Penang","Perak","Sabah","Sarawak","Kedah","Kelantan","Pahang","Terengganu","Negeri Sembilan","Melaka","Perlis","Putrajaya","Labuan"],
  "Philippines":     ["Metro Manila","Central Luzon","Calabarzon","Western Visayas","Central Visayas","Davao Region","Northern Mindanao","Soccsksargen","Zamboanga Peninsula","Bicol Region","Ilocos Region","Cagayan Valley","Caraga","Bangsamoro","Eastern Visayas","MIMAROPA","Cordillera","Eastern Samar","Western Samar"],
  "Pakistan":        ["Punjab","Sindh","Khyber Pakhtunkhwa","Balochistan","Islamabad Capital Territory","Gilgit-Baltistan","Azad Kashmir"],
  "Bangladesh":      ["Dhaka","Chittagong","Rajshahi","Khulna","Barishal","Sylhet","Rangpur","Mymensingh"],
  "Nigeria":         ["Lagos","Kano","Abuja (FCT)","Rivers","Ogun","Oyo","Delta","Anambra","Imo","Kaduna","Plateau","Cross River","Akwa Ibom","Enugu","Edo","Kogi","Ondo","Kwara","Borno","Adamawa","Osun","Niger","Ekiti","Abia","Gombe","Bauchi","Yobe","Zamfara","Kebbi","Sokoto","Taraba","Nassarawa","Benue","Jigawa","Katsina","Ebonyi","Bayelsa"],
  "South Africa":    ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape"],
  "Saudi Arabia":    ["Riyadh Region","Makkah Region","Madinah Region","Eastern Province","Asir Region","Tabuk Region","Qassim Region","Hail Region","Jazan Region","Najran Region","Jouf Region","Northern Borders Region","Bahah Region"],
  "Italy":           ["Lombardy","Lazio","Campania","Sicily","Veneto","Piedmont","Apulia","Tuscany","Emilia-Romagna","Calabria","Sardinia","Liguria","Marche","Abruzzo","Friuli-Venezia Giulia","Trentino-Alto Adige","Umbria","Basilicata","Molise","Valle d'Aosta"],
  "Spain":           ["Madrid","Catalonia","Andalusia","Valencia","Castile and León","Galicia","Basque Country","Castile-La Mancha","Canary Islands","Murcia","Aragon","Extremadura","Balearic Islands","Asturias","Navarre","Cantabria","La Rioja","Ceuta","Melilla"],
  "Netherlands":     ["North Holland","South Holland","Utrecht","North Brabant","Gelderland","Overijssel","Groningen","Friesland","Drenthe","Zeeland","Flevoland","Limburg"],
  "Turkey":          ["Istanbul","Ankara","Izmir","Bursa","Antalya","Adana","Konya","Gaziantep","Mersin","Diyarbakır","Kayseri","Eskişehir","Samsun","Denizli","Trabzon"],
  "Colombia":        ["Bogotá D.C.","Antioquia","Valle del Cauca","Cundinamarca","Atlántico","Bolívar","Santander","Nariño","Córdoba","Tolima","Cauca","Norte de Santander","Boyacá","Meta","Risaralda","Magdalena","Sucre","Huila","Caldas","Cesar","La Guajira","Chocó"],
  "Argentina":       ["Buenos Aires Province","Buenos Aires (City)","Córdoba","Santa Fe","Mendoza","Tucumán","Entre Ríos","Salta","Chaco","Corrientes","Misiones","Santiago del Estero","San Juan","Jujuy","Río Negro","Neuquén","Formosa","La Pampa","Santa Cruz","Chubut","Catamarca","La Rioja","San Luis","Tierra del Fuego"],
  "Egypt":           ["Cairo","Giza","Alexandria","Luxor","Aswan","Suez","Port Said","Ismailia","Mansoura","Tanta","Asyut","Zagazig","Faiyum","Damanhur","Minya","Qena","Sohag","Beni Suef","Kafr el-Sheikh","Damietta","Matruh"],
  "Ukraine":         ["Kyiv","Lviv","Odesa","Kharkiv","Dnipro","Zaporizhzhia","Vinnytsia","Poltava","Chernihiv","Sumy","Zhytomyr","Rivne","Ivano-Frankivsk","Ternopil","Khmelnytskyi","Cherkasy","Mykolaiv","Kherson","Chernivtsi","Transcarpathia","Kirovohrad"],
  "Russia":          ["Moscow","Saint Petersburg","Novosibirsk","Yekaterinburg","Kazan","Nizhny Novgorod","Chelyabinsk","Samara","Omsk","Rostov-on-Don","Ufa","Krasnoyarsk","Voronezh","Perm","Volgograd","Krasnodar","Saratov","Tyumen","Tolyatti","Izhevsk"],
};

// Cities per state (major cities)
const INTL_STATE_CITIES = {
  // USA states
  "California":              ["Los Angeles","San Francisco","San Diego","San Jose","Sacramento","Fresno","Long Beach","Oakland","Bakersfield","Anaheim","Santa Ana","Riverside","Stockton","Irvine","Chula Vista"],
  "New York":                ["New York City","Buffalo","Rochester","Yonkers","Syracuse","Albany","New Rochelle","Mount Vernon","Schenectady","Utica"],
  "Texas":                   ["Houston","San Antonio","Dallas","Austin","Fort Worth","El Paso","Arlington","Corpus Christi","Plano","Laredo","Lubbock","Irving","Garland","Frisco","McKinney"],
  "Florida":                 ["Jacksonville","Miami","Tampa","Orlando","St. Petersburg","Hialeah","Tallahassee","Fort Lauderdale","Port St. Lucie","Cape Coral","Pembroke Pines","Hollywood","Gainesville","Miramar"],
  "Illinois":                ["Chicago","Aurora","Joliet","Naperville","Rockford","Springfield","Elgin","Peoria","Waukegan","Champaign"],
  "Pennsylvania":            ["Philadelphia","Pittsburgh","Allentown","Erie","Reading","Scranton","Bethlehem","Lancaster","Harrisburg","Altoona"],
  "Ohio":                    ["Columbus","Cleveland","Cincinnati","Toledo","Akron","Dayton","Parma","Canton","Youngstown","Lorain"],
  "Georgia":                 ["Atlanta","Augusta","Columbus","Macon","Savannah","Athens","Sandy Springs","South Fulton","Roswell","Albany"],
  "Michigan":                ["Detroit","Grand Rapids","Warren","Sterling Heights","Ann Arbor","Lansing","Flint","Dearborn","Livonia","Westland"],
  "North Carolina":          ["Charlotte","Raleigh","Greensboro","Durham","Winston-Salem","Fayetteville","Cary","Wilmington","High Point","Asheville"],
  "Washington":              ["Seattle","Spokane","Tacoma","Vancouver","Bellevue","Kent","Everett","Renton","Kirkland","Bellingham"],
  "Arizona":                 ["Phoenix","Tucson","Mesa","Chandler","Scottsdale","Glendale","Gilbert","Tempe","Peoria","Surprise"],
  "Massachusetts":           ["Boston","Worcester","Springfield","Cambridge","Lowell","Brockton","Quincy","Lynn","New Bedford","Fall River"],
  "Tennessee":               ["Nashville","Memphis","Knoxville","Chattanooga","Clarksville","Murfreesboro","Franklin","Jackson","Johnson City","Kingsport"],
  "Indiana":                 ["Indianapolis","Fort Wayne","Evansville","South Bend","Carmel","Fishers","Bloomington","Hammond","Gary","Lafayette"],
  "Missouri":                ["Kansas City","St. Louis","Springfield","Columbia","Independence","Lee's Summit","O'Fallon","St. Joseph","St. Charles","Blue Springs"],
  "Maryland":                ["Baltimore","Columbia","Germantown","Silver Spring","Waldorf","Glen Burnie","Frederick","Ellicott City","Dundalk","Rockville"],
  "Wisconsin":               ["Milwaukee","Madison","Green Bay","Kenosha","Racine","Appleton","Waukesha","Eau Claire","Oshkosh","Janesville"],
  "Colorado":                ["Denver","Colorado Springs","Aurora","Fort Collins","Lakewood","Thornton","Arvada","Westminster","Pueblo","Centennial"],
  "Minnesota":               ["Minneapolis","St. Paul","Rochester","Duluth","Bloomington","Brooklyn Park","Plymouth","Maple Grove","Woodbury","St. Cloud"],
  "South Carolina":          ["Columbia","Charleston","North Charleston","Mount Pleasant","Rock Hill","Greenville","Summerville","Goose Creek","Hilton Head Island","Sumter"],
  "Alabama":                 ["Birmingham","Montgomery","Huntsville","Mobile","Tuscaloosa","Hoover","Dothan","Auburn","Decatur","Madison"],
  "Louisiana":               ["New Orleans","Baton Rouge","Shreveport","Metairie","Lafayette","Lake Charles","Kenner","Bossier City","Monroe","Alexandria"],
  "Kentucky":                ["Louisville","Lexington","Bowling Green","Owensboro","Covington","Georgetown","Florence","Hopkinsville","Nicholasville","Elizabethtown"],
  "Oregon":                  ["Portland","Salem","Eugene","Gresham","Hillsboro","Beaverton","Bend","Medford","Springfield","Corvallis"],
  "Oklahoma":                ["Oklahoma City","Tulsa","Norman","Broken Arrow","Lawton","Edmond","Moore","Midwest City","Enid","Stillwater"],
  "Connecticut":             ["Bridgeport","New Haven","Hartford","Stamford","Waterbury","Norwalk","Danbury","New Britain","Bristol","West Haven"],
  "Utah":                    ["Salt Lake City","West Valley City","Provo","West Jordan","Orem","Sandy","Ogden","St. George","Layton","Taylorsville"],
  "Iowa":                    ["Des Moines","Cedar Rapids","Davenport","Sioux City","Iowa City","Waterloo","Council Bluffs","Dubuque","Ankeny","Waukee"],
  "Nevada":                  ["Las Vegas","Henderson","Reno","North Las Vegas","Sparks","Carson City","Fernley","Elko","Mesquite","Boulder City"],
  "Arkansas":                ["Little Rock","Fort Smith","Fayetteville","Springdale","Jonesboro","Conway","Rogers","Pine Bluff","Bentonville","Hot Springs"],
  "Kansas":                  ["Wichita","Overland Park","Kansas City","Topeka","Olathe","Lawrence","Shawnee","Manhattan","Lenexa","Salina"],
  "Mississippi":             ["Jackson","Gulfport","Southaven","Hattiesburg","Biloxi","Meridian","Tupelo","Olive Branch","Horn Lake","Pearl"],
  "New Mexico":              ["Albuquerque","Las Cruces","Rio Rancho","Santa Fe","Roswell","Farmington","Clovis","Hobbs","Alamogordo","Carlsbad"],
  "Nebraska":                ["Omaha","Lincoln","Bellevue","Grand Island","Kearney","Fremont","Hastings","North Platte","Norfolk","Columbus"],
  "West Virginia":           ["Charleston","Huntington","Morgantown","Parkersburg","Wheeling","Weirton","Fairmont","Beckley","Martinsburg","Clarksburg"],
  "Idaho":                   ["Boise","Meridian","Nampa","Idaho Falls","Pocatello","Caldwell","Twin Falls","Post Falls","Lewiston","Rexburg"],
  "Hawaii":                  ["Honolulu","East Honolulu","Pearl City","Hilo","Kailua","Waipahu","Kaneohe","Mililani Town","Kahului","Kihei"],
  "New Hampshire":           ["Manchester","Nashua","Concord","Derry","Dover","Rochester","Salem","Merrimack","Hudson","Londonderry"],
  "Maine":                   ["Portland","Lewiston","Bangor","South Portland","Auburn","Biddeford","Sanford","Saco","Augusta","Westbrook"],
  "Montana":                 ["Billings","Missoula","Great Falls","Bozeman","Butte","Helena","Kalispell","Havre","Anaconda","Miles City"],
  "Rhode Island":            ["Providence","Cranston","Warwick","Pawtucket","East Providence","Woonsocket","Coventry","Cumberland","North Providence","West Warwick"],
  "Delaware":                ["Wilmington","Dover","Newark","Middletown","Smyrna","Milford","Seaford","Georgetown","Elsmere","New Castle"],
  "South Dakota":            ["Sioux Falls","Rapid City","Aberdeen","Brookings","Watertown","Mitchell","Yankton","Pierre","Huron","Vermillion"],
  "North Dakota":            ["Fargo","Bismarck","Grand Forks","Minot","West Fargo","Williston","Dickinson","Mandan","Jamestown","Wahpeton"],
  "Alaska":                  ["Anchorage","Fairbanks","Juneau","Sitka","Ketchikan","Wasilla","Kenai","Kodiak","Bethel","Palmer"],
  "Vermont":                 ["Burlington","Essex","South Burlington","Colchester","Shelburne","Bennington","Brattleboro","Middlebury","Barre","Montpelier"],
  "Wyoming":                 ["Cheyenne","Casper","Laramie","Gillette","Rock Springs","Sheridan","Green River","Evanston","Riverton","Jackson"],
  // UK
  "England":                 ["London","Birmingham","Manchester","Leeds","Sheffield","Bristol","Leicester","Coventry","Bradford","Nottingham","Newcastle upon Tyne","Southampton","Liverpool","Derby","Plymouth","Wolverhampton","Oxford","Cambridge","Reading","Luton","Portsmouth","Brighton","Milton Keynes","Sunderland","Stoke-on-Trent","Exeter"],
  "Scotland":                ["Glasgow","Edinburgh","Aberdeen","Dundee","Inverness","Stirling","Perth","Paisley","Livingston","East Kilbride","Motherwell","Hamilton","Dunfermline","Kirkcaldy"],
  "Wales":                   ["Cardiff","Swansea","Newport","Wrexham","Barry","Neath","Bridgend","Cwmbran","Llanelli","Caerphilly","Rhondda","Merthyr Tydfil"],
  "Northern Ireland":        ["Belfast","Derry","Lisburn","Newtownabbey","Bangor","Craigavon","Castlereagh","Ballymena","Newtownards","Antrim"],
  // Australia
  "New South Wales":         ["Sydney","Newcastle","Wollongong","Maitland","Central Coast","Albury","Wagga Wagga","Tamworth","Port Macquarie","Dubbo","Coffs Harbour","Bathurst","Orange"],
  "Victoria":                ["Melbourne","Geelong","Ballarat","Bendigo","Shepparton","Latrobe","Wodonga","Mildura","Warrnambool","Sale","Traralgon","Wangaratta"],
  "Queensland":              ["Brisbane","Gold Coast","Sunshine Coast","Townsville","Cairns","Toowoomba","Mackay","Rockhampton","Bundaberg","Hervey Bay","Gladstone","Ipswich"],
  "Western Australia":       ["Perth","Fremantle","Mandurah","Bunbury","Geraldton","Albany","Kalgoorlie","Rockingham","Armadale","Joondalup"],
  "South Australia":         ["Adelaide","Mount Gambier","Whyalla","Murray Bridge","Port Augusta","Victor Harbor","Port Lincoln","Gawler","Port Pirie","Berri"],
  "Tasmania":                ["Hobart","Launceston","Devonport","Burnie","Ulverstone","Clarence","Kingston","Glenorchy","Sorell","New Norfolk"],
  "Australian Capital Territory": ["Canberra","Belconnen","Tuggeranong","Weston Creek","Gungahlin","Woden Valley"],
  "Northern Territory":      ["Darwin","Alice Springs","Katherine","Palmerston","Nhulunbuy","Tennant Creek","Jabiru"],
  // Canada
  "Ontario":                 ["Toronto","Ottawa","Mississauga","Brampton","Hamilton","London","Markham","Vaughan","Kitchener","Windsor","Richmond Hill","Oakville","Burlington","Oshawa","Barrie","Kingston","Sudbury","Guelph","Waterloo","Cambridge"],
  "British Columbia":        ["Vancouver","Surrey","Burnaby","Richmond","Kelowna","Abbotsford","Coquitlam","Langley","Saanich","Delta","Kamloops","Nanaimo","Prince George","Victoria","Chilliwack"],
  "Alberta":                 ["Calgary","Edmonton","Red Deer","Lethbridge","Airdrie","Medicine Hat","Grande Prairie","Spruce Grove","Leduc","St. Albert","Fort McMurray","Sherwood Park"],
  "Quebec":                  ["Montreal","Quebec City","Laval","Gatineau","Longueuil","Sherbrooke","Saguenay","Lévis","Trois-Rivières","Terrebonne","Saint-Jean-sur-Richelieu","Repentigny","Brossard"],
  "Manitoba":                ["Winnipeg","Brandon","Steinbach","Thompson","Portage la Prairie","Selkirk","Winkler","Morden","Dauphin","The Pas"],
  "Saskatchewan":            ["Saskatoon","Regina","Prince Albert","Moose Jaw","Swift Current","Yorkton","North Battleford","Estevan","Weyburn","Humboldt"],
  "Nova Scotia":             ["Halifax","Dartmouth","Sydney","Truro","New Glasgow","Glace Bay","Yarmouth","Bridgewater","Kentville","Amherst"],
  "New Brunswick":           ["Moncton","Saint John","Fredericton","Dieppe","Riverview","Bathurst","Miramichi","Edmundston","Campbellton","Shediac"],
  // Germany
  "Bavaria":                 ["Munich","Nuremberg","Augsburg","Regensburg","Würzburg","Erlangen","Ingolstadt","Fürth","Bayreuth","Aschaffenburg"],
  "North Rhine-Westphalia":  ["Cologne","Düsseldorf","Dortmund","Essen","Duisburg","Bochum","Wuppertal","Bonn","Bielefeld","Münster","Gelsenkirchen","Aachen","Mönchengladbach","Oberhausen","Krefeld"],
  "Baden-Württemberg":       ["Stuttgart","Mannheim","Karlsruhe","Freiburg","Heidelberg","Heilbronn","Ulm","Pforzheim","Reutlingen","Tübingen"],
  "Lower Saxony":            ["Hanover","Braunschweig","Osnabrück","Oldenburg","Wolfsburg","Göttingen","Salzgitter","Hildesheim","Lüneburg","Delmenhorst"],
  "Hesse":                   ["Frankfurt","Wiesbaden","Kassel","Darmstadt","Offenbach","Fulda","Marburg","Gießen","Hanau","Göttingen"],
  "Berlin":                  ["Berlin"],
  "Hamburg":                 ["Hamburg"],
  "Saxony":                  ["Dresden","Leipzig","Chemnitz","Zwickau","Görlitz","Plauen","Erfurt","Jena","Gera","Erfurt"],
  // France
  "Île-de-France":           ["Paris","Boulogne-Billancourt","Versailles","Nanterre","Argenteuil","Montreuil","Saint-Denis","Créteil","Vitry-sur-Seine","Colombes","Asnières-sur-Seine","Aubervilliers","Aulnay-sous-Bois"],
  "Auvergne-Rhône-Alpes":    ["Lyon","Grenoble","Saint-Étienne","Villeurbanne","Clermont-Ferrand","Chambéry","Annecy","Valence","Roanne","Bourg-en-Bresse"],
  "Occitanie":               ["Toulouse","Montpellier","Nîmes","Perpignan","Béziers","Narbonne","Alès","Carcassonne","Tarbes","Rodez"],
  "Nouvelle-Aquitaine":      ["Bordeaux","Limoges","Poitiers","Pau","La Rochelle","Agen","Périgueux","Angoulême","Brive-la-Gaillarde","Niort"],
  "Hauts-de-France":         ["Lille","Amiens","Roubaix","Tourcoing","Dunkirk","Valenciennes","Lens","Béthune","Calais","Douai"],
  "Provence-Alpes-Côte d'Azur": ["Marseille","Nice","Toulon","Aix-en-Provence","Antibes","Cannes","Nîmes","Avignon","La Seyne-sur-Mer","Fréjus"],
  "Grand Est":               ["Strasbourg","Reims","Metz","Nancy","Mulhouse","Colmar","Troyes","Épinal","Charleville-Mézières","Saint-Louis"],
  "Pays de la Loire":        ["Nantes","Angers","Le Mans","Saint-Nazaire","La Roche-sur-Yon","Laval","Cholet","Saumur","Vendôme"],
  "Normandie":               ["Rouen","Caen","Le Havre","Cherbourg","Évreux","Alençon","Bayeux","Dieppe","Lisieux","Bernay"],
  "Bretagne":                ["Rennes","Brest","Quimper","Lorient","Vannes","Saint-Brieuc","Saint-Malo","Fougères","Lanester","Auray"],
  // Brazil
  "São Paulo":               ["São Paulo","Campinas","Guarulhos","Santo André","São Bernardo do Campo","Osasco","Ribeirão Preto","Sorocaba","Santos","Mauá","São José dos Campos","Mogi das Cruzes","Betim","Piracicaba","Jundiaí"],
  "Rio de Janeiro":          ["Rio de Janeiro","São Gonçalo","Duque de Caxias","Nova Iguaçu","Niterói","Belford Roxo","São João de Meriti","Campos dos Goytacazes","Petrópolis","Volta Redonda","Angra dos Reis"],
  "Minas Gerais":            ["Belo Horizonte","Uberlândia","Contagem","Juiz de Fora","Betim","Montes Claros","Ribeirão das Neves","Uberaba","Governador Valadares","Ipatinga"],
  // Mexico
  "Mexico City":             ["Mexico City","Ecatepec","Nezahualcóyotl","Iztapalapa","Gustavo A. Madero","Cuauhtémoc","Tlalpan","Xochimilco","Álvaro Obregón","Coyoacán"],
  "Jalisco":                 ["Guadalajara","Zapopan","Tlaquepaque","Tonalá","Tlajomulco de Zúñiga","Lagos de Moreno","Puerto Vallarta","Ciudad Guzmán","Ocotlán","Tepatitlán de Morelos"],
  "Nuevo León":              ["Monterrey","Guadalupe","Apodaca","San Nicolás de los Garza","Juárez","Santa Catarina","General Escobedo","García","Cadereyta Jiménez","Santiago"],
  // China
  "Guangdong":               ["Guangzhou","Shenzhen","Dongguan","Foshan","Zhongshan","Zhuhai","Huizhou","Jiangmen","Shantou","Zhanjiang","Maoming"],
  "Jiangsu":                 ["Nanjing","Suzhou","Wuxi","Nantong","Changzhou","Xuzhou","Yangzhou","Zhenjiang","Yancheng","Taizhou"],
  "Zhejiang":                ["Hangzhou","Ningbo","Wenzhou","Shaoxing","Jiaxing","Huzhou","Jinhua","Zhoushan","Taizhou","Quzhou"],
  "Sichuan":                 ["Chengdu","Mianyang","Nanchong","Leshan","Deyang","Zigong","Panzhihua","Suining","Luzhou","Yibin"],
  "Beijing":                 ["Beijing"],
  "Shanghai":                ["Shanghai"],
  "Tianjin":                 ["Tianjin"],
  "Chongqing":               ["Chongqing"],
  // Japan
  "Tokyo":                   ["Tokyo","Shinjuku","Shibuya","Minato","Chiyoda","Koto","Sumida","Nerima","Setagaya","Adachi"],
  "Osaka":                   ["Osaka","Sakai","Higashiosaka","Yao","Ibaraki","Suita","Neyagawa","Toyonaka","Takatsuki","Hirakata"],
  "Kanagawa":                ["Yokohama","Kawasaki","Sagamihara","Fujisawa","Yokosuka","Chigasaki","Hiratsuka","Odawara","Atsugi","Zama"],
  "Aichi":                   ["Nagoya","Toyota","Okazaki","Ichinomiya","Toyohashi","Kasugai","Nishio","Ogaki","Anjo","Komaki"],
  "Fukuoka":                 ["Fukuoka","Kitakyushu","Kurume","Omuta","Kasuga","Dazaifu","Iizuka","Munakata","Tagawa","Yukuhashi"],
  // South Korea
  "Seoul":                   ["Seoul","Gangnam","Seocho","Mapo","Yeongdeungpo","Jongno","Jung","Dongdaemun","Gwanak","Gwangjin"],
  "Gyeonggi":                ["Suwon","Goyang","Yongin","Seongnam","Bucheon","Ansan","Anyang","Hwaseong","Gimpo","Uijeongbu"],
  "Busan":                   ["Busan","Haeundae","Suyeong","Dong","Nam","Busanjin","Buk","Seo","Dongnae","Geumjeong"],
  // Indonesia
  "Jakarta":                 ["Jakarta","South Jakarta","North Jakarta","East Jakarta","West Jakarta","Central Jakarta"],
  "West Java":               ["Bandung","Bekasi","Depok","Bogor","Cimahi","Tasikmalaya","Sukabumi","Cilegon","Serang","Tangerang"],
  "East Java":               ["Surabaya","Malang","Sidoarjo","Gresik","Mojokerto","Pasuruan","Probolinggo","Blitar","Kediri","Jember"],
  "Bali":                    ["Denpasar","Kuta","Seminyak","Ubud","Sanur","Nusa Dua","Canggu","Tabanan","Gianyar","Singaraja"],
  "Yogyakarta":              ["Yogyakarta","Sleman","Bantul","Gunung Kidul","Kulon Progo"],
  // Malaysia
  "Kuala Lumpur":            ["Kuala Lumpur","Chow Kit","Bukit Bintang","Mont Kiara","Damansara","Kepong","Bangsar","Setapak"],
  "Selangor":                ["Petaling Jaya","Shah Alam","Subang Jaya","Klang","Rawang","Ampang","Kajang","Puchong","Cheras","Sepang"],
  "Johor":                   ["Johor Bahru","Skudai","Pasir Gudang","Kulai","Pontian","Batu Pahat","Muar","Kluang","Kota Tinggi","Segamat"],
  "Penang":                  ["George Town","Butterworth","Bukit Mertajam","Bayan Lepas","Nibong Tebal","Sungai Bakap","Permatang Pauh"],
  "Sabah":                   ["Kota Kinabalu","Sandakan","Tawau","Lahad Datu","Keningau","Semporna","Kudat","Beaufort","Kunak"],
  "Sarawak":                 ["Kuching","Miri","Sibu","Bintulu","Limbang","Sri Aman","Sarikei","Mukah","Kapit","Betong"],
  // Philippines
  "Metro Manila":            ["Quezon City","Manila","Makati","Pasig","Taguig","Marikina","Paranaque","Pasay","Mandaluyong","Valenzuela","Caloocan","Las Pinas","Malabon","Navotas","Pateros","San Juan"],
  "Central Luzon":           ["Angeles","San Fernando","Olongapo","Malolos","Cabanatuan","Palayan","San Jose","Tarlac","Balanga","Meycauayan"],
  "Calabarzon":              ["Calamba","Santa Rosa","Antipolo","Dasmariñas","Bacoor","Imus","General Trias","Biñan","San Pedro","Carmona","Lucena","Batangas City","Lipa","Tagaytay"],
  "Central Visayas":         ["Cebu City","Mandaue","Lapu-Lapu","Talisay","Danao","Toledo","Bogo","Carcar","Tagbilaran","Dumaguete"],
  "Davao Region":            ["Davao City","Tagum","Panabo","Mati","Digos","Samal","Island Garden City of Samal","Compostela"],
  // Pakistan
  "Punjab":                  ["Lahore","Faisalabad","Rawalpindi","Gujranwala","Multan","Sargodha","Sialkot","Bahawalpur","Sheikhupura","Jhang","Rahim Yar Khan","Gujrat","Kasur","Okara","Wah Cantonment"],
  "Sindh":                   ["Karachi","Hyderabad","Sukkur","Larkana","Nawabshah","Mirpurkhas","Jacobabad","Shikarpur","Khairpur","Kotri","Dadu"],
  "Khyber Pakhtunkhwa":      ["Peshawar","Mardan","Mingora","Kohat","Abbottabad","Nowshera","Mansehra","Dera Ismail Khan","Swat","Charsadda","Bannu"],
  "Balochistan":             ["Quetta","Gwadar","Turbat","Khuzdar","Chaman","Hub","Dera Murad Jamali","Dera Allah Yar","Sibi","Mastung"],
  // Bangladesh divisions
  "Dhaka":                   ["Dhaka","Narayanganj","Gazipur","Manikganj","Munshiganj","Narsingdi","Faridpur","Rajbari","Gopalganj","Madaripur","Shariatpur","Tangail","Kishoreganj","Netrokona","Mymensingh","Jamalpur","Sherpur"],
  "Chittagong":              ["Chittagong","Cox's Bazar","Comilla","Noakhali","Chandpur","Lakshmipur","Brahmanbaria","Rangamati","Bandarban","Khagrachhari","Feni"],
  "Rajshahi":                ["Rajshahi","Bogra","Natore","Naogaon","Chapai Nawabganj","Joypurhat","Pabna","Sirajganj"],
  "Khulna":                  ["Khulna","Bagerhat","Satkhira","Jessore","Narail","Magura","Jhenaidah","Kushtia","Meherpur","Chuadanga"],
  "Sylhet":                  ["Sylhet","Moulvibazar","Habiganj","Sunamganj"],
  // Nigeria
  "Lagos":                   ["Lagos Island","Victoria Island","Ikeja","Surulere","Apapa","Mushin","Yaba","Lekki","Ajah","Ikorodu","Badagry","Epe","Alimosho","Ojo"],
  "Kano":                    ["Kano","Wudil","Gaya","Bichi","Rano","Minjibir","Doguwa","Dambatta"],
  "Rivers":                  ["Port Harcourt","Obio-Akpor","Eleme","Okrika","Ahoada","Degema","Khana","Bonny"],
  "Abuja (FCT)":             ["Abuja","Gwagwalada","Kuje","Abaji","Kwali","Bwari"],
  "Ogun":                    ["Abeokuta","Sagamu","Ijebu-Ode","Ota","Ilaro","Ayetoro","Igbo-Ora"],
  // South Africa
  "Gauteng":                 ["Johannesburg","Pretoria","Soweto","Ekurhuleni","Centurion","Sandton","Randburg","Germiston","Boksburg","Benoni","Midrand","Roodepoort","Vereeniging","Vanderbijlpark"],
  "Western Cape":            ["Cape Town","Stellenbosch","George","Paarl","Worcester","Knysna","Mossel Bay","Hermanus","Bellville","Somerset West"],
  "KwaZulu-Natal":           ["Durban","Pietermaritzburg","Richards Bay","Newcastle","Pinetown","Umhlanga","Ballito","Port Shepstone","Ladysmith","Empangeni"],
  "Eastern Cape":            ["Port Elizabeth","East London","Mthatha","Uitenhage","Grahamstown","King William's Town","Queenstown","Bhisho"],
  // Saudi Arabia
  "Riyadh Region":           ["Riyadh","Al Kharj","Dawadmi","Shaqra","Al Majmaah","Al Zulfi","Afif","Al Quwayiyah","Hotat Bani Tamim"],
  "Makkah Region":           ["Mecca","Jeddah","Taif","Al Qunfudhah","Rabigh","Al Lith","Al Jumum","Khulais"],
  "Madinah Region":          ["Medina","Yanbu","Al Ula","Al Mahd","Hail","Badr","Khaybar"],
  "Eastern Province":        ["Dammam","Al Khobar","Dhahran","Jubail","Al Qatif","Hafar Al-Batin","Abqaiq","Ras Tanura","Safwa"],
  // Italy
  "Lombardy":                ["Milan","Brescia","Monza","Bergamo","Como","Cremona","Varese","Lecco","Pavia","Mantua","Sondrio","Lodi"],
  "Lazio":                   ["Rome","Latina","Frosinone","Viterbo","Rieti","Tivoli","Civitavecchia","Guidonia Montecelio"],
  "Campania":                ["Naples","Salerno","Caserta","Avellino","Benevento","Pozzuoli","Torre del Greco","Castellammare di Stabia","Giugliano in Campania"],
  "Sicily":                  ["Palermo","Catania","Messina","Syracuse","Ragusa","Trapani","Agrigento","Caltanissetta","Enna"],
  "Veneto":                  ["Venice","Verona","Padua","Vicenza","Treviso","Rovigo","Belluno","Mestre"],
  "Tuscany":                 ["Florence","Pisa","Livorno","Arezzo","Siena","Grosseto","Pistoia","Prato","Lucca","Massa"],
  // Spain
  "Madrid":                  ["Madrid","Alcalá de Henares","Alcobendas","Alcorcón","Fuenlabrada","Getafe","Leganés","Móstoles","Parla","Torrejón de Ardoz"],
  "Catalonia":               ["Barcelona","Hospitalet de Llobregat","Badalona","Terrassa","Sabadell","Tarragona","Lleida","Girona","Mataró","Reus"],
  "Andalusia":               ["Seville","Málaga","Granada","Córdoba","Almería","Jerez de la Frontera","Cádiz","Huelva","Algeciras","Marbella"],
  "Valencia":                ["Valencia","Alicante","Elche","Castellón de la Plana","Torrent","Orihuela","Gandia","Benidorm","Vila-real","Paterna"],
  // Netherlands
  "North Holland":           ["Amsterdam","Haarlem","Zaandam","Almere","Hilversum","Hoorn","Alkmaar","Purmerend","Heerhugowaard"],
  "South Holland":           ["Rotterdam","The Hague","Dordrecht","Leiden","Delft","Zoetermeer","Westland","Gouda","Spijkenisse","Schiedam"],
  "Utrecht":                 ["Utrecht","Amersfoort","Zeist","Veenendaal","Nieuwegein","Houten","De Bilt","Soest","Woerden","Bunnik"],
  "North Brabant":           ["Eindhoven","Tilburg","Breda","'s-Hertogenbosch","Helmond","Roosendaal","Bergen op Zoom","Oss","Venlo","Sittard"],
  // Turkey
  "Istanbul":                ["Istanbul","Kadıköy","Beşiktaş","Şişli","Beyoğlu","Fatih","Üsküdar","Maltepe","Pendik","Kartal","Ümraniye","Gaziosmanpaşa","Bağcılar","Küçükçekmece","Avcılar","Esenyurt"],
  "Ankara":                  ["Ankara","Çankaya","Keçiören","Mamak","Yenimahalle","Altındağ","Sincan","Etimesgut","Pursaklar","Gölbaşı"],
  "Izmir":                   ["İzmir","Konak","Karşıyaka","Bornova","Buca","Bayraklı","Balçova","Karabağlar","Cigli","Gaziemir"],
  "Antalya":                 ["Antalya","Alanya","Manavgat","Kemer","Belek","Side","Kaş","Finike","Serik","Aksu"],
  // Colombia
  "Bogotá D.C.":             ["Bogotá","Soacha","Zipaquirá","Facatativá","Chía","Mosquera","Funza","Madrid","Cajicá","La Calera"],
  "Antioquia":               ["Medellín","Bello","Itagüí","Envigado","Apartadó","Turbo","Rionegro","Sabaneta","Caldas","La Estrella"],
  "Valle del Cauca":         ["Cali","Buenaventura","Palmira","Tuluá","Buga","Yumbo","Cartago","Candelaria","Florida"],
  // Egypt
  "Cairo":                   ["Cairo","Heliopolis","Nasr City","Maadi","New Cairo","Shubra","Mohandessin","Zamalek","Dokki","Giza"],
  "Alexandria":              ["Alexandria","Sidi Gaber","Sporting","Cleopatra","Smouha","San Stefano","Agami","Montaza","Miami"],
  "Giza":                    ["Giza","6th of October City","Sheikh Zayed","Haram","Dokki","Mohandessin","Boulaq el Dakrour"],
  // Russia
  "Moscow":                  ["Moscow","Zelenograd","Shchyolkovo","Korolev","Khimki","Mytishchi","Lyubertsy","Balashikha","Odintsovo","Krasnogorsk","Podolsk","Serpukhov","Elektrostal","Ramenskoye"],
  "Saint Petersburg":        ["Saint Petersburg","Peterhof","Pushkin","Kolpino","Kronstadt","Lomonosov","Sestroretsk","Pavlovsk","Gatchina","Vyborg"],
  "Novosibirsk":             ["Novosibirsk","Berdsk","Iskitim","Ob","Krasnoobsk","Maslyanino"],
  // Russia more regions
  "Yekaterinburg":           ["Yekaterinburg","Pervouralsk","Nizhny Tagil","Kamensk-Uralsky","Berezovsky"],
  "Kazan":                   ["Kazan","Naberezhnye Chelny","Nizhnekamsk","Almetyevsk","Zelenodolsk"],
  "Nizhny Novgorod":         ["Nizhny Novgorod","Dzerzhinsk","Arzamas","Sarov","Balakhna","Bor"],
  "Chelyabinsk":             ["Chelyabinsk","Magnitogorsk","Zlatoust","Miass","Ozersk","Troitsk"],
  "Rostov-on-Don":           ["Rostov-on-Don","Taganrog","Novocherkassk","Shakhty","Bataysk"],
  "Krasnodar":               ["Krasnodar","Sochi","Novorossiysk","Armavir","Maikop"],
  "Ufa":                     ["Ufa","Sterlitamak","Salavat","Neftekamsk","Oktyabrsky","Tuymazy"],
  "Samara":                  ["Samara","Togliatti","Syzran","Novokuybyshevsk","Chapayevsk"],
  "Omsk":                    ["Omsk","Tara","Issilkul","Kalachinsk"],
  "Voronezh":                ["Voronezh","Liski","Rossosh","Borisoglebsk","Novovoronezh"],
  "Perm":                    ["Perm","Berezniki","Solikamsk","Lysva","Tchaikovsky","Kungur"],
  "Saratov":                 ["Saratov","Balakovo","Engels","Balashov","Volsk"],
  "Tyumen":                  ["Tyumen","Tobolsk","Surgut","Nizhnevartovsk","Noyabrsk","Nefteyugansk"],
  "Krasnoyarsk":             ["Krasnoyarsk","Norilsk","Achinsk","Zheleznogorsk","Minusinsk","Kansk"],
  "Volgograd":               ["Volgograd","Volzhsky","Kamyshin","Mikhaylovka","Uryupinsk"],
  "Izhevsk":                 ["Izhevsk","Sarapul","Votkinsk","Glazov","Mozhga"],
  // USA missing states
  "New Jersey":              ["Newark","Jersey City","Paterson","Elizabeth","Trenton","Clifton","Camden","Passaic","Union City","Bayonne","East Orange","Woodbridge","Hamilton","Toms River","Hoboken","Plainfield","New Brunswick"],
  "Virginia":                ["Virginia Beach","Norfolk","Chesapeake","Richmond","Newport News","Alexandria","Hampton","Roanoke","Portsmouth","Suffolk","Lynchburg","Charlottesville","Blacksburg","Manassas","Fredericksburg"],
  // Canada missing
  "Newfoundland and Labrador": ["St. John's","Corner Brook","Gander","Grand Falls-Windsor","Marystown","Stephenville","Happy Valley-Goose Bay"],
  "Prince Edward Island":    ["Charlottetown","Summerside","Stratford","Cornwall","Montague","Kensington"],
  // Germany missing
  "Rhineland-Palatinate":    ["Mainz","Ludwigshafen","Koblenz","Trier","Kaiserslautern","Worms","Neuwied","Pirmasens","Speyer"],
  "Schleswig-Holstein":      ["Kiel","Lübeck","Flensburg","Neumünster","Norderstedt","Pinneberg","Elmshorn","Rendsburg"],
  "Brandenburg":             ["Potsdam","Cottbus","Brandenburg an der Havel","Frankfurt (Oder)","Oranienburg","Eberswalde"],
  "Saxony-Anhalt":           ["Halle (Saale)","Magdeburg","Dessau-Roßlau","Wittenberg","Stendal","Bernburg","Halberstadt"],
  "Thuringia":               ["Erfurt","Jena","Gera","Weimar","Gotha","Nordhausen","Eisenach","Suhl"],
  "Bremen":                  ["Bremen","Bremerhaven"],
  "Mecklenburg-Vorpommern":  ["Rostock","Schwerin","Neubrandenburg","Greifswald","Stralsund","Wismar"],
  "Saarland":                ["Saarbrücken","Neunkirchen","Saarlouis","Völklingen","St. Ingbert","Homburg"],
  // France missing
  "Bourgogne-Franche-Comté": ["Dijon","Besançon","Belfort","Chalon-sur-Saône","Auxerre","Montbéliard","Mâcon","Nevers"],
  "Centre-Val de Loire":     ["Tours","Orléans","Bourges","Blois","Chartres","Châteauroux","Amboise","Vierzon"],
  "Corse":                   ["Ajaccio","Bastia","Porto-Vecchio","Corte","Calvi","Sartène"],
  // Brazil missing states
  "Bahia":                   ["Salvador","Feira de Santana","Vitória da Conquista","Camaçari","Itabuna","Ilhéus","Barreiras","Alagoinhas","Porto Seguro"],
  "Paraná":                  ["Curitiba","Londrina","Maringá","Ponta Grossa","Cascavel","São José dos Pinhais","Foz do Iguaçu","Colombo","Guarapuava"],
  "Rio Grande do Sul":       ["Porto Alegre","Caxias do Sul","Pelotas","Canoas","Santa Maria","Gravataí","Novo Hamburgo","São Leopoldo","Rio Grande"],
  "Pernambuco":              ["Recife","Caruaru","Olinda","Paulista","Petrolina","Jaboatão dos Guararapes","Cabo de Santo Agostinho","Garanhuns"],
  "Ceará":                   ["Fortaleza","Caucaia","Juazeiro do Norte","Maracanaú","Sobral","Crato","Maranguape","Iguatu"],
  "Pará":                    ["Belém","Ananindeua","Santarém","Marabá","Castanhal","Parauapebas","Abaetetuba"],
  "Goiás":                   ["Goiânia","Aparecida de Goiânia","Anápolis","Rio Verde","Luziânia","Trindade","Formosa"],
  "Amazonas":                ["Manaus","Parintins","Itacoatiara","Manacapuru","Coari","Tefé","Tabatinga"],
  "Santa Catarina":          ["Joinville","Florianópolis","Blumenau","São José","Criciúma","Chapecó","Itajaí","Lages","Palhoça","Balneário Camboriú"],
  "Maranhão":                ["São Luís","Imperatriz","São José de Ribamar","Timon","Caxias","Codó","Açailândia","Bacabal"],
  "Espírito Santo":          ["Vitória","Serra","Vila Velha","Cariacica","Cachoeiro de Itapemirim","Linhares","São Mateus","Guarapari"],
  "Distrito Federal":        ["Brasília","Ceilândia","Taguatinga","Samambaia","Aguas Claras","Guará","Sobradinho","Gama"],
  "Paraíba":                 ["João Pessoa","Campina Grande","Santa Rita","Patos","Bayeux","Sousa","Cajazeiras","Cabedelo"],
  "Rio Grande do Norte":     ["Natal","Mossoró","Parnamirim","São Gonçalo do Amarante","Macaíba","Caicó"],
  "Alagoas":                 ["Maceió","Arapiraca","Rio Largo","Palmeira dos Índios","União dos Palmares","Penedo"],
  "Mato Grosso":             ["Cuiabá","Várzea Grande","Rondonópolis","Sinop","Tangará da Serra","Cáceres","Sorriso","Lucas do Rio Verde"],
  "Mato Grosso do Sul":      ["Campo Grande","Dourados","Três Lagoas","Corumbá","Ponta Porã","Naviraí","Aquidauana"],
  "Piauí":                   ["Teresina","Parnaíba","Picos","Floriano","Piripiri","Campo Maior","São Raimundo Nonato"],
  "Sergipe":                 ["Aracaju","Nossa Senhora do Socorro","Lagarto","Itabaiana","São Cristóvão","Estância"],
  "Tocantins":               ["Palmas","Araguaína","Gurupi","Porto Nacional","Paraíso do Tocantins"],
  "Rondônia":                ["Porto Velho","Ji-Paraná","Ariquemes","Vilhena","Cacoal","Rolim de Moura"],
  "Acre":                    ["Rio Branco","Cruzeiro do Sul","Sena Madureira","Tarauacá","Feijó","Brasiléia"],
  "Amapá":                   ["Macapá","Santana","Laranjal do Jari","Oiapoque","Mazagão"],
  "Roraima":                 ["Boa Vista","Rorainópolis","Caracaraí","Alto Alegre","Mucajaí"],
  // Mexico missing states
  "State of Mexico":         ["Toluca","Ecatepec","Naucalpan","Tlalnepantla","Chimalhuacán","Ixtapaluca","Texcoco","Cuautitlán Izcalli"],
  "Puebla":                  ["Puebla","Tehuacán","San Martín Texmelucan","Atlixco","Cholula","Izúcar de Matamoros"],
  "Guanajuato":              ["León","Irapuato","Celaya","Salamanca","Guanajuato City","Silao","Pénjamo","Dolores Hidalgo","Acámbaro"],
  "Chihuahua":               ["Ciudad Juárez","Chihuahua","Cuauhtémoc","Delicias","Hidalgo del Parral","Nuevo Casas Grandes"],
  "Baja California":         ["Tijuana","Mexicali","Ensenada","Tecate","Rosarito","Playas de Rosarito"],
  "Veracruz":                ["Veracruz","Xalapa","Coatzacoalcos","Minatitlán","Córdoba","Orizaba","Poza Rica","Tuxpan"],
  "Sonora":                  ["Hermosillo","Ciudad Obregón","Nogales","San Luis Río Colorado","Navojoa","Guaymas"],
  "Tamaulipas":              ["Reynosa","Matamoros","Nuevo Laredo","Tampico","Ciudad Victoria","Altamira","Río Bravo"],
  "Sinaloa":                 ["Culiacán","Mazatlán","Los Mochis","Guasave","Ahome","Navolato"],
  "Coahuila":                ["Saltillo","Torreón","Monclova","Piedras Negras","Ciudad Acuña","San Pedro"],
  "Oaxaca":                  ["Oaxaca City","Salina Cruz","Juchitán","Tuxtepec","Huatulco","Puerto Escondido"],
  "Tabasco":                 ["Villahermosa","Cárdenas","Comalcalco","Cunduacán","Huimanguillo","Macuspana"],
  "Guerrero":                ["Acapulco","Chilpancingo","Iguala","Taxco","Zihuatanejo","Tlapa"],
  "Querétaro":               ["Querétaro City","San Juan del Río","Corregidora","El Marqués","Pedro Escobedo"],
  "Yucatán":                 ["Mérida","Valladolid","Kanasín","Tizimín","Progreso","Motul"],
  "Michoacán":               ["Morelia","Uruapan","Apatzingán","Lázaro Cárdenas","Zamora","Zitácuaro","La Piedad"],
  "San Luis Potosí":         ["San Luis Potosí City","Soledad de Graciano Sánchez","Ciudad Valles","Matehuala","Tamazunchale"],
  "Quintana Roo":            ["Cancún","Chetumal","Playa del Carmen","Cozumel","Tulum","Isla Mujeres"],
  "Hidalgo":                 ["Pachuca","Tulancingo","Tula de Allende","Ixmiquilpan","Huejutla de Reyes"],
  "Aguascalientes":          ["Aguascalientes City","Jesús María","Calvillo","San Francisco de los Romo"],
  "Morelos":                 ["Cuernavaca","Jiutepec","Cuautla","Temixco","Ayala","Xochitepec"],
  "Tlaxcala":                ["Tlaxcala City","Apizaco","Huamantla","Calpulalpan","Chiautempan"],
  "Durango":                 ["Durango City","Gómez Palacio","Lerdo","Santiago Papasquiaro"],
  "Zacatecas":               ["Zacatecas City","Guadalupe","Fresnillo","Pinos","Jerez","Sombrerete"],
  "Chiapas":                 ["Tuxtla Gutiérrez","San Cristóbal de las Casas","Tapachula","Comitán","Tonalá","Palenque"],
  "Campeche":                ["Campeche City","Ciudad del Carmen","Champotón","Calkiní"],
  "Colima":                  ["Colima City","Manzanillo","Tecomán","Villa de Álvarez"],
  "Nayarit":                 ["Tepic","Bahía de Banderas","Santiago Ixcuintla","Compostela","Tecuala"],
  "Baja California Sur":     ["La Paz","Los Cabos","Cabo San Lucas","San José del Cabo","Loreto"],
  // Japan missing prefectures
  "Kyoto":                   ["Kyoto","Uji","Maizuru","Kameoka","Joyo","Muko"],
  "Hokkaido":                ["Sapporo","Asahikawa","Hakodate","Obihiro","Kushiro","Tomakomai","Otaru","Muroran","Kitami"],
  "Hyogo":                   ["Kobe","Himeji","Akashi","Nishinomiya","Amagasaki","Kakogawa","Itami","Takarazuka"],
  "Shizuoka":                ["Shizuoka","Hamamatsu","Numazu","Fuji","Mishima","Iwata","Kakegawa","Shimada"],
  "Ibaraki":                 ["Mito","Tsukuba","Hitachi","Toride","Ushiku","Joso","Ryugasaki","Hitachinaka"],
  "Hiroshima":               ["Hiroshima","Fukuyama","Kure","Higashihiroshima","Mihara","Onomichi"],
  "Miyagi":                  ["Sendai","Ishinomaki","Osaki","Natori","Tome","Tagajo","Kesennuma"],
  "Niigata":                 ["Niigata","Nagaoka","Joetsu","Sanjō","Kashiwazaki","Tsubame","Shibata"],
  "Nagano":                  ["Nagano","Matsumoto","Ueda","Iida","Suwa","Ina","Komoro","Saku"],
  "Tochigi":                 ["Utsunomiya","Oyama","Tochigi City","Sano","Mooka","Nikko"],
  "Gunma":                   ["Maebashi","Takasaki","Kiryu","Isesaki","Ota","Numata","Tatebayashi"],
  "Okayama":                 ["Okayama","Kurashiki","Tsuyama","Tamano","Sōja","Niimi","Kasaoka"],
  "Kumamoto":                ["Kumamoto","Yatsushiro","Hitoyoshi","Arao","Minamata","Tamana"],
  "Kagoshima":               ["Kagoshima","Kirishima","Kanoya","Amami","Ibusuki","Satsumasendai"],
  "Yamaguchi":               ["Yamaguchi","Shimonoseki","Ube","Sanyoonoda","Iwakuni","Hofu"],
  "Ehime":                   ["Matsuyama","Imabari","Uwajima","Niihama","Saijo","Yawatahama"],
  "Nara":                    ["Nara","Kashihara","Yamato Koriyama","Yamatotakada","Sakurai","Tenri","Ikoma"],
  "Okinawa":                 ["Naha","Okinawa City","Uruma","Urasoe","Nago","Ginowan","Tomigusuku"],
  "Mie":                     ["Tsu","Yokkaichi","Suzuka","Matsusaka","Kuwana","Ise","Nabari"],
  "Shiga":                   ["Otsu","Kusatsu","Moriyama","Nagahama","Higashiomi","Ritto","Konan"],
  "Gifu":                    ["Gifu","Ogaki","Kakamigahara","Tajimi","Seki","Nakatsugawa","Minokamo"],
  "Wakayama":                ["Wakayama","Kainan","Hashimoto","Arida","Tanabe","Shingu"],
  "Kochi":                   ["Kochi","Aki","Tosa","Susaki","Nankoku","Muroto","Shimanto"],
  "Saga":                    ["Saga","Tosu","Karatsu","Imari","Takeo","Ogi","Ureshino"],
  "Yamanashi":               ["Kofu","Fuefuki","Kai","Chuo","Hokuto","Otsuki","Tsuru"],
  "Toyama":                  ["Toyama","Takaoka","Imizu","Himi","Nanto","Namerikawa","Kurobe"],
  "Akita":                   ["Akita","Yokote","Daisen","Noshiro","Yuzawa","Odate"],
  "Aomori":                  ["Aomori","Hachinohe","Hirosaki","Misawa","Towada","Mutsu"],
  "Iwate":                   ["Morioka","Ichinoseki","Oshu","Kitakami","Hanamaki","Miyako"],
  "Nagasaki":                ["Nagasaki","Sasebo","Isahaya","Omura","Goto","Matsuura"],
  "Oita":                    ["Oita","Beppu","Nakatsu","Hita","Saiki","Usuki"],
  "Miyazaki":                ["Miyazaki","Miyakonojo","Nobeoka","Hyuga","Nichinan","Kobayashi"],
  "Shimane":                 ["Matsue","Izumo","Hamada","Masuda","Yasugi"],
  "Tottori":                 ["Tottori","Yonago","Kurayoshi","Sakaiminato"],
  "Fukui":                   ["Fukui","Tsuruga","Sabae","Obama","Katsuyama","Ono"],
  "Ishikawa":                ["Kanazawa","Komatsu","Hakusan","Nonoichi","Wajima","Nanao"],
  "Yamagata":                ["Yamagata","Tsuruoka","Sakata","Yonezawa","Tendo","Kaminoyama"],
  "Kagawa":                  ["Takamatsu","Marugame","Sakaide","Kan'onji","Sanuki"],
  "Tokushima":               ["Tokushima","Naruto","Anan","Yoshinogawa","Awa"],
  // South Korea missing
  "Incheon":                 ["Incheon","Namdong","Bupyeong","Yeonsu","Michuhol","Ganghwa"],
  "Daegu":                   ["Daegu","Dalseo","Suseong","Nam","Buk","Dong"],
  "Daejeon":                 ["Daejeon","Seo","Yuseong","Jung","Dong","Daedeok"],
  "Gwangju":                 ["Gwangju","Buk","Gwangsan","Seo","Nam","Dong"],
  "Ulsan":                   ["Ulsan","Nam","Dong","Buk","Jung","Ulju"],
  "Sejong":                  ["Sejong"],
  "Jeju":                    ["Jeju City","Seogwipo"],
  "Gangwon":                 ["Chuncheon","Gangneung","Wonju","Sokcho","Donghae","Samcheok"],
  "North Chungcheong":       ["Cheongju","Chungju","Jecheon","Boeun","Okcheon","Yeongdong"],
  "South Chungcheong":       ["Cheonan","Gongju","Boryeong","Asan","Seosan","Nonsan","Dangjin","Aasan"],
  "North Jeolla":            ["Jeonju","Gunsan","Iksan","Jeongeup","Namwon","Gimje","Wanju"],
  "South Jeolla":            ["Gwangyang","Yeosu","Suncheon","Naju","Damyang","Gokseong","Gurye"],
  "North Gyeongsang":        ["Pohang","Gumi","Gyeongju","Andong","Gunwi","Yeongcheon","Sangju"],
  "South Gyeongsang":        ["Changwon","Jinju","Tongyeong","Sacheon","Gimhae","Miryang","Geoje"],
  // South Africa missing
  "Limpopo":                 ["Polokwane","Mokopane","Bela-Bela","Tzaneen","Phalaborwa","Lephalale","Makhado"],
  "Mpumalanga":              ["Nelspruit","Witbank","Middelburg","Secunda","Standerton","Ermelo"],
  "North West":              ["Rustenburg","Klerksdorp","Potchefstroom","Mafikeng","Brits","Lichtenburg"],
  "Free State":              ["Bloemfontein","Welkom","Bethlehem","Sasolburg","Kroonstad","Botshabelo"],
  "Northern Cape":           ["Kimberley","Upington","De Aar","Kuruman","Springbok","Prieska"],
  // Bangladesh missing
  "Barishal":                ["Barishal","Pirojpur","Bhola","Patuakhali","Barguna","Jhalokati"],
  "Rangpur":                 ["Rangpur","Dinajpur","Gaibandha","Kurigram","Nilphamari","Lalmonirhat","Thakurgaon"],
  "Mymensingh":              ["Mymensingh","Netrokona","Kishoreganj","Jamalpur","Sherpur"],
  // Pakistan missing
  "Islamabad Capital Territory": ["Islamabad","Rawalpindi"],
  "Gilgit-Baltistan":        ["Gilgit","Skardu","Ghanche","Diamer","Hunza","Nagar"],
  "Azad Kashmir":            ["Muzaffarabad","Mirpur","Rawalakot","Bhimber","Kotli","Bagh"],
  // Saudi Arabia missing regions
  "Asir Region":             ["Abha","Khamis Mushait","Bisha","Sabya","Tathlith"],
  "Tabuk Region":            ["Tabuk","Duba","Haql","Umluj","Al Wajh","Tayma"],
  "Qassim Region":           ["Buraydah","Unaizah","Ar Rass","Al Mithnab","Al Badayea"],
  "Hail Region":             ["Hail","Al Ghazalah","Baqaa"],
  "Jazan Region":            ["Jazan","Sabya","Abu Arish","Samtah","Baysh"],
  "Najran Region":           ["Najran","Sharurah","Badr Al Janub"],
  "Jouf Region":             ["Sakaka","Dumat Al Jandal","Al Qurayyat","Tabarjal"],
  "Northern Borders Region": ["Arar","Rafha","Turaif"],
  "Bahah Region":            ["Al Baha","Al Makhwah","Qilwah","Baljurashi"],
  // Italy missing regions
  "Piedmont":                ["Turin","Novara","Alessandria","Asti","Vercelli","Cuneo","Biella"],
  "Apulia":                  ["Bari","Taranto","Foggia","Brindisi","Lecce","Andria","Barletta"],
  "Emilia-Romagna":          ["Bologna","Modena","Parma","Reggio Emilia","Ferrara","Rimini","Ravenna","Forlì","Piacenza"],
  "Calabria":                ["Reggio Calabria","Catanzaro","Cosenza","Crotone","Vibo Valentia","Lamezia Terme"],
  "Sardinia":                ["Cagliari","Sassari","Quartu Sant'Elena","Nuoro","Oristano","Olbia"],
  "Liguria":                 ["Genoa","La Spezia","Savona","Imperia","Sanremo","Rapallo"],
  "Marche":                  ["Ancona","Pesaro","Ascoli Piceno","Fano","Macerata","Senigallia"],
  "Abruzzo":                 ["Pescara","Chieti","L'Aquila","Teramo","Lanciano","Vasto","Avezzano"],
  "Friuli-Venezia Giulia":   ["Trieste","Udine","Pordenone","Monfalcone","Gorizia"],
  "Trentino-Alto Adige":     ["Trento","Bolzano","Rovereto","Merano","Bressanone"],
  "Umbria":                  ["Perugia","Terni","Spoleto","Foligno","Città di Castello","Gubbio","Assisi"],
  "Basilicata":              ["Potenza","Matera","Melfi","Policoro"],
  "Molise":                  ["Campobasso","Isernia","Termoli"],
  "Valle d'Aosta":           ["Aosta","Saint-Vincent","Châtillon","Sarre"],
  // Spain missing
  "Basque Country":          ["Bilbao","San Sebastián","Vitoria-Gasteiz","Barakaldo","Getxo","Irun","Santurtzi"],
  "Galicia":                 ["Vigo","A Coruña","Pontevedra","Santiago de Compostela","Lugo","Ferrol","Ourense"],
  "Castile and León":        ["Valladolid","Burgos","Salamanca","León","Ávila","Palencia","Segovia","Zamora"],
  "Castile-La Mancha":       ["Albacete","Ciudad Real","Cuenca","Guadalajara","Toledo","Talavera de la Reina"],
  "Canary Islands":          ["Las Palmas de Gran Canaria","Santa Cruz de Tenerife","La Laguna","Arona","Telde"],
  "Murcia":                  ["Murcia","Cartagena","Lorca","Molina de Segura","Alcantarilla","Yecla"],
  "Aragon":                  ["Zaragoza","Huesca","Teruel","Calatayud","Jaca","Monzón"],
  "Extremadura":             ["Badajoz","Cáceres","Mérida","Plasencia","Don Benito","Almendralejo"],
  "Balearic Islands":        ["Palma","Ibiza","Manacor","Maó","Calvia","Inca","Ciutadella"],
  "Asturias":                ["Oviedo","Gijón","Avilés","Siero","Langreo","Mieres"],
  "Navarre":                 ["Pamplona","Tudela","Barañáin","Burlada","Estella","Tafalla"],
  "Cantabria":               ["Santander","Torrelavega","Castro-Urdiales","Camargo","Laredo"],
  "Spain::La Rioja":         ["Logroño","Calahorra","Arnedo","Haro","Alfaro","Nájera"],
  "Ceuta":                   ["Ceuta"],
  "Melilla":                 ["Melilla"],
  // Netherlands missing
  "Gelderland":              ["Nijmegen","Arnhem","Apeldoorn","Ede","Wageningen","Doetinchem","Harderwijk","Zutphen"],
  "Overijssel":              ["Enschede","Zwolle","Almelo","Deventer","Hengelo","Oldenzaal","Kampen"],
  "Groningen":               ["Groningen","Veendam","Stadskanaal","Winschoten","Delfzijl"],
  "Friesland":               ["Leeuwarden","Drachten","Sneek","Heerenveen","Franeker","Harlingen"],
  "Drenthe":                 ["Assen","Emmen","Hoogeveen","Meppel","Coevorden"],
  "Zeeland":                 ["Middelburg","Vlissingen","Terneuzen","Goes","Hulst","Zierikzee"],
  "Flevoland":               ["Almere","Lelystad","Dronten","Zeewolde","Urk"],
  "Limburg":                 ["Maastricht","Heerlen","Venlo","Sittard","Geleen","Weert","Roermond"],
  // Turkey missing
  "Bursa":                   ["Bursa","Osmangazi","Nilüfer","Yıldırım","İnegöl","Gemlik","Mudanya"],
  "Adana":                   ["Adana","Ceyhan","Kozan","İmamoğlu","Seyhan","Çukurova"],
  "Konya":                   ["Konya","Ereğli","Akşehir","Karaman","Kulu","Seydişehir"],
  "Gaziantep":               ["Gaziantep","Şahinbey","Şehitkamil","Nizip","Islahiye","Karkamış"],
  "Mersin":                  ["Mersin","Tarsus","Erdemli","Silifke","Mut","Anamur"],
  "Diyarbakır":              ["Diyarbakır","Ergani","Bismil","Silvan","Lice","Çermik"],
  "Kayseri":                 ["Kayseri","Melikgazi","Kocasinan","Talas","Develi","Yahyalı"],
  "Eskişehir":               ["Eskişehir","Tepebaşı","Odunpazarı","Sivrihisar","Mihalıçcık"],
  "Samsun":                  ["Samsun","Bafra","Çarşamba","Terme","Alaçam","Kavak"],
  "Denizli":                 ["Denizli","Çorlu","Merkezefendi","Pamukkale","Sarayköy","Çal"],
  "Trabzon":                 ["Trabzon","Akçaabat","Ortahisar","Of","Vakfıkebir","Araklı"],
  // Colombia missing
  "Cundinamarca":            ["Soacha","Zipaquirá","Facatativá","Chía","Mosquera","Fusagasugá","Girardot"],
  "Atlántico":               ["Barranquilla","Soledad","Malambo","Sabanalarga","Baranoa","Puerto Colombia"],
  "Bolívar":                 ["Cartagena","Magangué","El Carmen de Bolívar","Turbaco","Arjona"],
  "Santander":               ["Bucaramanga","Floridablanca","Girón","Piedecuesta","Barrancabermeja","Socorro"],
  "Nariño":                  ["Pasto","Ipiales","Tumaco","Túquerres","La Unión","Sandoná"],
  "Colombia::Córdoba":       ["Montería","Lorica","Sahagún","Cereté","San Pelayo"],
  "Tolima":                  ["Ibagué","Espinal","Melgar","Mariquita","Líbano","Honda","Chaparral"],
  "Norte de Santander":      ["Cúcuta","Ocaña","Pamplona","Villa del Rosario","Los Patios"],
  "Boyacá":                  ["Tunja","Duitama","Sogamoso","Chiquinquirá","Puerto Boyacá"],
  "Meta":                    ["Villavicencio","Acacías","Cumaral","Granada","Restrepo"],
  // Argentina missing
  "Buenos Aires Province":   ["La Plata","Mar del Plata","Bahía Blanca","Quilmes","Avellaneda","Morón","Merlo","Tigre","San Isidro"],
  "Buenos Aires (City)":     ["Buenos Aires","Palermo","Recoleta","San Telmo","Belgrano","Caballito","Flores"],
  "Argentina::Córdoba":      ["Córdoba","Villa María","Río Cuarto","San Francisco","Alta Gracia","Jesús María"],
  "Santa Fe":                ["Rosario","Santa Fe City","Rafaela","Venado Tuerto","Reconquista","San Lorenzo"],
  "Mendoza":                 ["Mendoza","San Rafael","Godoy Cruz","Maipú","Luján de Cuyo","Las Heras","Guaymallén"],
  "Tucumán":                 ["San Miguel de Tucumán","Concepción","Yerba Buena","Tafí Viejo","Aguilares"],
  "Salta":                   ["Salta","San Ramón de la Nueva Orán","Tartagal","General Güemes","Metán"],
  "Misiones":                ["Posadas","Eldorado","Oberá","Puerto Iguazú","Apóstoles","Leandro N. Alem"],
  "Entre Ríos":              ["Paraná","Concordia","Gualeguaychú","Concepción del Uruguay","Gualeguay"],
  "Chaco":                   ["Resistencia","Barranqueras","Fontana","Villa Ángela","Presidencia Roque Sáenz Peña"],
  "Corrientes":              ["Corrientes","Goya","Paso de los Libres","Mercedes","Curuzú Cuatiá"],
  "Jujuy":                   ["San Salvador de Jujuy","San Pedro","Palpalá","Libertador General San Martín"],
  "Río Negro":               ["Viedma","Bariloche","General Roca","Cipolletti","Villa Regina","Allen"],
  "Neuquén":                 ["Neuquén","San Martín de los Andes","Cutral Có","Zapala","Centenario"],
  "Formosa":                 ["Formosa","Clorinda","Pirané","General Belgrano"],
  "La Pampa":                ["Santa Rosa","General Pico","Toay","Eduardo Castex","Realicó"],
  "Santa Cruz":              ["Río Gallegos","El Calafate","Caleta Olivia","Puerto Madryn","Pico Truncado"],
  "Chubut":                  ["Rawson","Comodoro Rivadavia","Trelew","Puerto Madryn","Esquel"],
  "Catamarca":               ["San Fernando del Valle de Catamarca","Andalgalá","Tinogasta","Belén"],
  "Argentina::La Rioja":     ["La Rioja City","Chilecito","Chamical","Aimogasta"],
  "San Juan":                ["San Juan City","Rawson","Rivadavia","Chimbas","Santa Lucía","Pocito"],
  "San Luis":                ["San Luis City","Villa Mercedes","Merlo","Justo Daract","La Toma"],
  "Tierra del Fuego":        ["Ushuaia","Río Grande","Tolhuin"],
  // Egypt missing
  "Luxor":                   ["Luxor","Karnak","Armant","Esna"],
  "Aswan":                   ["Aswan","Edfu","Kom Ombo","Abu Simbel","Daraw"],
  "Port Said":               ["Port Said","Port Fouad"],
  "Mansoura":                ["Mansoura","Talkha","Shirbin"],
  "Tanta":                   ["Tanta","Kafr el-Zayat","Mahalla el-Kubra","Basyoun"],
  "Asyut":                   ["Asyut","Manfalut","Abnoub","El-Badari"],
  "Faiyum":                  ["Faiyum","Ibshaway","Tamiya","Sinnuris"],
  "Beni Suef":               ["Beni Suef","El Wasta","Biba","Fashn"],
  "Qena":                    ["Qena","Nag Hammadi","Luxor","Deshna","Abu Tesht"],
  "Sohag":                   ["Sohag","Akhmim","Girgā","Tahta","Tima","Girga"],
  "Minya":                   ["Minya","Mallawi","Abu Qurqas","Maghagha","Beni Mazar"],
  "Kafr el-Sheikh":          ["Kafr el-Sheikh","Desouk","Sidi Salem","Metoubes","Fuwwah"],
  "Damietta":                ["Damietta","New Damietta","Faraskur","Az Zarqa"],
  "Matruh":                  ["Marsa Matruh","Salloum","Siwa","Mersa Matruh"],
  // Ukraine missing
  "Kyiv":                    ["Kyiv","Irpin","Bucha","Brovary","Boryspil","Fastiv","Vasylkiv"],
  "Lviv":                    ["Lviv","Drohobych","Boryslav","Stryi","Chervonograd","Sambir"],
  "Odesa":                   ["Odesa","Bilhorod-Dnistrovskyi","Izmayil","Yuzhne","Chornomorsk"],
  "Kharkiv":                 ["Kharkiv","Lozova","Kupiansk","Merefa","Chuhuiv"],
  "Dnipro":                  ["Dnipro","Kryvyi Rih","Kamianske","Nikopol","Pavlograd"],
  "Zaporizhzhia":            ["Zaporizhzhia","Melitopol","Berdyansk","Enerhodar"],
  "Vinnytsia":               ["Vinnytsia","Khmilnyk","Bershad","Ladyzhyn"],
  "Poltava":                 ["Poltava","Kremenchuk","Komsomolsk","Lubny","Myrhorod"],
  "Chernihiv":               ["Chernihiv","Nizhyn","Pryluky","Borzna"],
  "Sumy":                    ["Sumy","Shostka","Konotop","Romny","Okhtyrka"],
  "Zhytomyr":                ["Zhytomyr","Berdychiv","Novograd-Volynsky","Korosten"],
  "Rivne":                   ["Rivne","Dubno","Ostroh","Sarny","Kostopil"],
  "Ivano-Frankivsk":         ["Ivano-Frankivsk","Kolomyia","Kalush","Stryi","Bolekhiv"],
  "Ternopil":                ["Ternopil","Kremenets","Chortkiv","Husiatyn","Berezhany"],
  "Khmelnytskyi":            ["Khmelnytskyi","Kamianets-Podilskyi","Shepetivka","Netishyn"],
  "Cherkasy":                ["Cherkasy","Uman","Zolotonosha","Smila","Kaniv"],
  "Mykolaiv":                ["Mykolaiv","Pervomaysk","Voznesensk","Bashtanka"],
  "Kherson":                 ["Kherson","Nova Kakhovka","Henichesk","Kakhovka"],
  "Chernivtsi":              ["Chernivtsi","Khotyn","Novoselytsia","Storozhynets"],
  "Transcarpathia":          ["Uzhhorod","Mukachevo","Khust","Berehove","Vynohradiv"],
  "Kirovohrad":              ["Kropyvnytskyi","Oleksandriia","Znamyanka","Svitlovodsk"],
  // China missing provinces
  "Shandong":                ["Jinan","Qingdao","Zibo","Weifang","Yantai","Weihai","Jining","Zaozhuang","Linyi","Dongying","Tai'an","Binzhou","Dezhou","Liaocheng","Heze"],
  "Henan":                   ["Zhengzhou","Luoyang","Kaifeng","Nanyang","Xinxiang","Anyang","Jiaozuo","Zhoukou","Zhumadian","Xinyang","Puyang","Xuchang","Luohe","Sanmenxia","Pingdingshan"],
  "Hebei":                   ["Shijiazhuang","Tangshan","Baoding","Handan","Qinhuangdao","Cangzhou","Langfang","Zhangjiakou","Chengde","Hengshui","Xingtai"],
  "Hubei":                   ["Wuhan","Yichang","Xiangyang","Jingzhou","Huangshi","Xiaogan","Shiyan","Jingmen","Ezhou","Huanggang","Suizhou","Enshi"],
  "Hunan":                   ["Changsha","Zhuzhou","Xiangtan","Hengyang","Shaoyang","Yueyang","Changde","Yiyang","Chenzhou","Yongzhou","Huaihua","Loudi","Zhangjiajie"],
  "Fujian":                  ["Fuzhou","Xiamen","Quanzhou","Zhangzhou","Sanming","Putian","Nanping","Longyan","Ningde"],
  "Anhui":                   ["Hefei","Wuhu","Huainan","Bengbu","Tongling","Ma'anshan","Anqing","Huangshan","Fuyang","Suzhou","Lu'an","Xuancheng","Chuzhou","Chizhou","Bozhou"],
  "Liaoning":                ["Shenyang","Dalian","Anshan","Fushun","Benxi","Dandong","Jinzhou","Liaoyang","Yingkou","Panjin","Chaoyang","Tieling","Huludao"],
  "Jilin":                   ["Changchun","Jilin City","Siping","Tonghua","Baicheng","Yanbian","Liaoyuan","Baishan","Songyuan"],
  "Heilongjiang":            ["Harbin","Qiqihar","Daqing","Mudanjiang","Jiamusi","Heihe","Suihua","Hegang","Shuangyashan","Jixi","Qitaihe","Yichun"],
  "Shanxi":                  ["Taiyuan","Datong","Yangquan","Changzhi","Linfen","Yuncheng","Jinzhong","Lvliang","Xinzhou","Shuozhou","Jincheng"],
  "Shaanxi":                 ["Xi'an","Xianyang","Baoji","Weinan","Hanzhong","Ankang","Yulin","Yan'an","Shangluo","Tongchuan"],
  "Jiangxi":                 ["Nanchang","Jingdezhen","Ganzhou","Jiujiang","Xinyu","Yichun","Fuzhou","Shangrao","Ji'an","Pingxiang","Yingtan"],
  "Yunnan":                  ["Kunming","Qujing","Yuxi","Baoshan","Lijiang","Pu'er","Dali","Xishuangbanna","Dehong","Zhaotong","Lincang","Wenshan","Honghe"],
  "Guizhou":                 ["Guiyang","Zunyi","Anshun","Tongren","Bijie","Liupanshui","Qiannan","Qiandongnan","Qianxinan"],
  "Gansu":                   ["Lanzhou","Tianshui","Jiayuguan","Baiyin","Jinchang","Zhangye","Wuwei","Jiuquan","Qingyang","Pingliang","Dingxi","Longnan","Linxia"],
  "Inner Mongolia":          ["Hohhot","Baotou","Ordos","Chifeng","Tongliao","Hulunbuir","Bayannur","Wulanqab","Xilin Gol","Alxa"],
  "Xinjiang":                ["Ürümqi","Kashgar","Hotan","Aksu","Turpan","Shihezi","Yining","Korla","Altay","Tacheng"],
  "Tibet":                   ["Lhasa","Shigatse","Nagqu","Nyingchi","Qamdo","Ali","Lhokha"],
  "Guangxi":                 ["Nanning","Guilin","Liuzhou","Beihai","Guigang","Wuzhou","Qinzhou","Fangchenggang","Yulin","Baise","Hezhou","Hechi","Laibin","Chongzuo"],
  "Hainan":                  ["Haikou","Sanya","Wuzhishan","Qionghai","Wanning","Dongfang","Chengmai","Ding'an","Tunchang"],
  "Ningxia":                 ["Yinchuan","Shizuishan","Wuzhong","Guyuan","Zhongwei"],
  "Qinghai":                 ["Xining","Haidong","Golmud","Delingha","Yushu","Golog"],
  // Indonesia missing provinces
  "Central Java":            ["Semarang","Solo","Magelang","Pekalongan","Tegal","Salatiga","Purwokerto","Surakarta","Kudus","Klaten","Boyolali","Purworejo"],
  "Banten":                  ["Tangerang","Serang","Cilegon","South Tangerang","Pandeglang","Lebak"],
  "North Sumatra":           ["Medan","Binjai","Pematangsiantar","Padangsidimpuan","Tebing Tinggi","Tanjungbalai","Langkat","Deli Serdang","Asahan"],
  "South Sumatra":           ["Palembang","Lubuklinggau","Prabumulih","Pagar Alam","Baturaja","Kayuagung"],
  "West Sumatra":            ["Padang","Bukittinggi","Payakumbuh","Solok","Padangpanjang","Sawahlunto","Pariaman"],
  "Riau":                    ["Pekanbaru","Dumai","Bengkalis","Siak","Rengat","Bangkinang","Tembilahan"],
  "Lampung":                 ["Bandar Lampung","Metro","Kalianda","Kotabumi","Liwa","Menggala"],
  "South Sulawesi":          ["Makassar","Parepare","Palopo","Watampone","Sungguminasa","Pangkajene","Barru"],
  "North Sulawesi":          ["Manado","Bitung","Tomohon","Tondano","Kotamobagu","Tahuna","Amurang"],
  "West Kalimantan":         ["Pontianak","Singkawang","Sambas","Mempawah","Sanggau","Ketapang"],
  "South Kalimantan":        ["Banjarmasin","Banjarbaru","Martapura","Tanah Bumbu","Kotabaru","Amuntai"],
  "East Kalimantan":         ["Samarinda","Balikpapan","Bontang","Sangatta","Penajam","Tenggarong"],
  "Papua":                   ["Jayapura","Timika","Merauke","Sorong","Nabire","Biak","Wamena"],
  "West Papua":              ["Manokwari","Sorong","Fakfak","Kaimana","Teluk Bintuni","Ayamaru"],
  "Maluku":                  ["Ambon","Tual","Masohi","Namlea","Saumlaki","Dobo"],
  "North Maluku":            ["Ternate","Tidore","Tobelo","Labuha","Sanana","Weda"],
  "Aceh":                    ["Banda Aceh","Lhokseumawe","Langsa","Sabang","Meulaboh","Singkil","Subulussalam"],
  // Malaysia missing states
  "Perak":                   ["Ipoh","Taiping","Teluk Intan","Sitiawan","Lumut","Kuala Kangsar","Bidor"],
  "Kedah":                   ["Alor Setar","Sungai Petani","Kulim","Baling","Kuala Kedah","Pokok Sena","Langkawi"],
  "Kelantan":                ["Kota Bharu","Gua Musang","Pasir Mas","Tanah Merah","Machang","Kuala Krai","Rantau Panjang"],
  "Pahang":                  ["Kuantan","Temerloh","Raub","Bentong","Kuala Lipis","Pekan","Jerantut"],
  "Terengganu":              ["Kuala Terengganu","Kemaman","Kerteh","Dungun","Marang","Besut","Hulu Terengganu"],
  "Negeri Sembilan":         ["Seremban","Port Dickson","Nilai","Bahau","Rembau","Tampin","Kuala Pilah"],
  "Melaka":                  ["Melaka City","Alor Gajah","Masjid Tanah","Jasin","Ayer Keroh","Merlimau"],
  "Perlis":                  ["Kangar","Arau","Padang Besar","Wang Kelian"],
  "Putrajaya":               ["Putrajaya"],
  "Labuan":                  ["Victoria","Labuan Town"],
  // Philippines missing regions
  "Western Visayas":         ["Iloilo City","Bacolod","Roxas City","Kalibo","San Jose","Victorias","Sagay","Kabankalan"],
  "Northern Mindanao":       ["Cagayan de Oro","Iligan","Ozamiz","Oroquieta","Tangub","Gingoog","El Salvador","Malaybalay"],
  "Soccsksargen":            ["General Santos","Koronadal","Kidapawan","Cotabato City","Tacurong","Surallah","Tupi"],
  "Zamboanga Peninsula":     ["Zamboanga City","Pagadian","Dipolog","Dapitan","Isabela City","Ipil","Molave"],
  "Bicol Region":            ["Legazpi","Naga","Sorsogon City","Iriga","Tabaco","Ligao","Masbate City","Virac"],
  "Ilocos Region":           ["San Fernando","Vigan","Laoag","Dagupan","Urdaneta","Alaminos","Candon","Batac"],
  "Cagayan Valley":          ["Tuguegarao","Ilagan","Cauayan","Solano","Bayombong","Cabagan","Santiago"],
  "Caraga":                  ["Butuan","Surigao City","Bislig","Cabadbaran","Bayugan","Tandag","Cantilan"],
  "Bangsamoro":              ["Cotabato City","Marawi","Jolo","Bongao","Lamitan","Sultan Kudarat"],
  "Eastern Visayas":         ["Tacloban","Ormoc","Calbayog","Catbalogan","Maasin","Naval","Borongan"],
  "MIMAROPA":                ["Calapan","Puerto Princesa","Romblon","San Jose","Boac","Odiongan"],
  "Cordillera":              ["Baguio","Tabuk","Bangued","Bontoc","Lagawe","Banaue","La Trinidad"],
  "Eastern Samar":           ["Borongan","Guiuan","Oras","Salcedo","Maydolong"],
  "Western Samar":           ["Catbalogan","Gandara","Calbiga","Basey","Motiong"],
  // Nigeria missing states
  "Oyo":                     ["Ibadan","Ogbomosho","Oyo","Ede","Iseyin","Saki","Igboho"],
  "Delta":                   ["Warri","Asaba","Sapele","Ughelli","Agbor","Effurun","Abraka","Burutu"],
  "Anambra":                 ["Onitsha","Nnewi","Awka","Ekwulobia","Oba","Ogidi","Ihiala"],
  "Imo":                     ["Owerri","Orlu","Okigwe","Oguta","Mbaise","Ngor Okpala"],
  "Kaduna":                  ["Kaduna","Zaria","Kafanchan","Birnin Gwari","Soba","Lere","Jema'a"],
  "Plateau":                 ["Jos","Bukuru","Pankshin","Mangu","Barkin Ladi","Shendam","Langtang"],
  "Cross River":             ["Calabar","Ugep","Ikom","Obudu","Ogoja","Akamkpa"],
  "Akwa Ibom":               ["Uyo","Eket","Ikot Ekpene","Oron","Abak","Itu","Essien Udim"],
  "Enugu":                   ["Enugu","Nsukka","Oji River","Awgu","Agbani","Ezeagu","Nkanu"],
  "Edo":                     ["Benin City","Auchi","Uromi","Ekpoma","Igarra","Okpela","Sabongida-Ora"],
  "Kogi":                    ["Lokoja","Okene","Idah","Kabba","Bassa","Ankpa","Dekina"],
  "Ondo":                    ["Akure","Ondo Town","Owo","Ikare","Ile-Oluji","Okitipupa","Irele"],
  "Kwara":                   ["Ilorin","Offa","Omu-Aran","Patigi","Jebba","Lafiagi","Kaiama"],
  "Borno":                   ["Maiduguri","Biu","Gwoza","Bama","Dikwa","Ngala","Monguno"],
  "Adamawa":                 ["Yola","Jimeta","Numan","Mubi","Ganye","Michika","Jada"],
  "Osun":                    ["Osogbo","Ilesa","Ile-Ife","Ede","Iwo","Ikirun","Gbongan"],
  "Niger":                   ["Minna","Bida","Suleja","Kontagora","Lapai","Agaie","Mokwa"],
  "Ekiti":                   ["Ado-Ekiti","Ikere-Ekiti","Ijero-Ekiti","Emure-Ekiti","Ilawe","Aramoko","Efon-Alaaye"],
  "Abia":                    ["Umuahia","Aba","Bende","Ohafia","Isuikwuato","Arochukwu","Ikwuano"],
  "Gombe":                   ["Gombe","Dukku","Kaltungo","Kwami","Funakaye","Nafada","Shongom"],
  "Bauchi":                  ["Bauchi","Azare","Misau","Darazo","Itas","Ningi","Jamaare"],
  "Yobe":                    ["Damaturu","Potiskum","Gashua","Nguru","Geidam","Bade","Bursari"],
  "Zamfara":                 ["Gusau","Talata Mafara","Anka","Maru","Zurmi","Kaura Namoda","Maradun"],
  "Kebbi":                   ["Birnin Kebbi","Argungu","Yauri","Koko","Jega","Bagudo","Shanga"],
  "Sokoto":                  ["Sokoto","Bodinga","Gada","Gwadabawa","Illela","Wamako","Tangaza"],
  "Taraba":                  ["Jalingo","Bali","Gashaka","Karim Lamido","Wukari","Ardo Kola","Sardauna"],
  "Nassarawa":               ["Lafia","Keffi","Nasarawa","Akwanga","Wamba","Awe","Obi"],
  "Benue":                   ["Makurdi","Gboko","Otukpo","Katsina-Ala","Oturkpo","Vandeikya","Gwer East"],
  "Jigawa":                  ["Dutse","Hadejia","Birnin Kudu","Kazaure","Gumel","Guri","Ringim"],
  "Katsina":                 ["Katsina","Daura","Funtua","Malumfashi","Kankia","Mashi","Jibia"],
  "Ebonyi":                  ["Abakaliki","Afikpo","Onueke","Ishiagu","Ezza-Ohu","Ikwo","Ohaozara"],
  "Bayelsa":                 ["Yenagoa","Brass","Ogbia","Sagbama","Nembe","Ekeremor","Kolokuma"],
  // Colombia missing departments
  "Cauca":                   ["Popayán","Santander de Quilichao","Patía","El Bordo","Miranda","Puerto Tejada"],
  "Magdalena":               ["Santa Marta","Ciénaga","Fundación","El Banco","Plato","Aracataca","Guamal"],
  "Sucre":                   ["Sincelejo","Corozal","Sahagún","San Marcos","Morroa","San Onofre","Tolú"],
  "Huila":                   ["Neiva","Pitalito","Garzón","La Plata","Campoalegre","Rivera","Palermo"],
  "Caldas":                  ["Manizales","Villamaría","La Dorada","Chinchiná","Riosucio","Salamina","Manzanares"],
  "Cesar":                   ["Valledupar","Aguachica","Bosconia","La Paz","Manaure","Codazzi","El Copey"],
  "La Guajira":              ["Riohacha","Maicao","Fonseca","San Juan del Cesar","Dibulla","Albania","Villanueva"],
  "Chocó":                   ["Quibdó","Acandí","Istmina","Riosucio","Condoto","Nuquí","Tadó"],
  "Risaralda":               ["Pereira","Dosquebradas","Santa Rosa de Cabal","La Virginia","Apía","Quinchía"],
  // Egypt missing governorates
  "Suez":                    ["Suez City","Ain Sokhna","Fayed","Adabiya"],
  "Ismailia":                ["Ismailia","Qantara","Fayed","Abu Suweir"],
  "Zagazig":                 ["Zagazig","Belbeis","Minya el-Qamh","Abu Hammad","Diyarb Negm"],
  "Damanhur":                ["Damanhur","Kafr el-Dawwar","Rashid","Kom Hamada","Shubrakhit"],
  // Argentina missing province
  "Santiago del Estero":     ["Santiago del Estero City","La Banda","Termas de Río Hondo","Añatuya","Quimilí","Frías","Loreto"],
};

// For countries without states, direct city list
const INTL_COUNTRY_CITIES = {
  "UAE":             ["Dubai","Abu Dhabi","Sharjah","Ajman","Ras Al Khaimah","Fujairah","Umm Al Quwain","Al Ain"],
  "Singapore":       ["Singapore","Orchard","Marina Bay","Jurong","Tampines","Woodlands","Buona Vista","Raffles Place","Clarke Quay","Changi"],
  "Qatar":           ["Doha","Al Rayyan","Al Wakrah","Al Khor","Lusail","Al Daayen","Umm Salal","Al Shahaniya"],
  "Kuwait":          ["Kuwait City","Hawalli","Salmiya","Farwaniya","Jahra","Ahmadi","Fahaheel","Mangaf","Salwa"],
  "Bahrain":         ["Manama","Riffa","Muharraq","Hamad Town","Isa Town","Sitra","Jidhafs","Tubli","Zinj","Adliya"],
  "Oman":            ["Muscat","Salalah","Sohar","Nizwa","Khasab","Sur","Ibri","Barka","Rustaq","Samail"],
  "Hong Kong":       ["Central","Kowloon","Causeway Bay","Tsim Sha Tsui","Mong Kok","Wan Chai","Admiralty","Sham Shui Po","Tuen Mun","Sha Tin"],
  "Taiwan":          ["Taipei","New Taipei","Taichung","Kaohsiung","Tainan","Hsinchu","Keelung","Taoyuan","Chiayi","Changhua"],
  "Sri Lanka":       ["Colombo","Kandy","Galle","Negombo","Jaffna","Trincomalee","Batticaloa","Anuradhapura","Matara","Kurunegala"],
  "Nepal":           ["Kathmandu","Pokhara","Lalitpur","Bhaktapur","Biratnagar","Birgunj","Dharan","Butwal","Hetauda","Bharatpur"],
  "Myanmar":         ["Yangon","Mandalay","Naypyidaw","Bago","Mawlamyine","Taunggyi","Pathein","Monywa","Myeik","Lashio"],
  "Vietnam":         ["Ho Chi Minh City","Hanoi","Da Nang","Hai Phong","Bien Hoa","Can Tho","Hue","Nha Trang","Vung Tau","Buon Ma Thuot"],
  "Cambodia":        ["Phnom Penh","Siem Reap","Sihanoukville","Battambang","Kampot","Kep","Pursat","Kampong Cham"],
  "Thailand":        ["Bangkok","Chiang Mai","Phuket","Pattaya","Hat Yai","Nakhon Ratchasima","Udon Thani","Chon Buri","Hua Hin","Chiang Rai"],
  "New Zealand":     ["Auckland","Wellington","Christchurch","Hamilton","Tauranga","Napier","Dunedin","Palmerston North","Rotorua","Whangarei"],
  "Ireland":         ["Dublin","Cork","Limerick","Galway","Waterford","Drogheda","Dundalk","Swords","Dún Laoghaire","Bray"],
  "Sweden":          ["Stockholm","Gothenburg","Malmö","Uppsala","Västerås","Örebro","Linköping","Helsingborg","Jönköping","Norrköping"],
  "Norway":          ["Oslo","Bergen","Trondheim","Stavanger","Drammen","Fredrikstad","Kristiansand","Sandnes","Tromsø","Skien"],
  "Denmark":         ["Copenhagen","Aarhus","Odense","Aalborg","Esbjerg","Randers","Kolding","Horsens","Vejle","Roskilde"],
  "Switzerland":     ["Zurich","Geneva","Basel","Bern","Lausanne","Lucerne","Winterthur","St. Gallen","Lugano","Biel"],
  "Belgium":         ["Brussels","Antwerp","Ghent","Charleroi","Liège","Bruges","Namur","Leuven","Mons","Aalst"],
  "Poland":          ["Warsaw","Kraków","Łódź","Wrocław","Poznań","Gdańsk","Szczecin","Bydgoszcz","Katowice","Białystok"],
  "Portugal":        ["Lisbon","Porto","Braga","Coimbra","Funchal","Setúbal","Viseu","Leiria","Faro","Aveiro"],
  "Austria":         ["Vienna","Graz","Linz","Salzburg","Innsbruck","Klagenfurt","Villach","Wels","St. Pölten","Steyr"],
  "Czech Republic":  ["Prague","Brno","Ostrava","Plzeň","Liberec","Olomouc","Ústí nad Labem","České Budějovice","Pardubice","Hradec Králové"],
  "Hungary":         ["Budapest","Debrecen","Miskolc","Pécs","Győr","Nyíregyháza","Kecskemét","Székesfehérvár","Szombathely","Érd"],
  "Romania":         ["Bucharest","Cluj-Napoca","Timișoara","Iași","Constanța","Craiova","Brașov","Galați","Ploiești","Oradea"],
  "Greece":          ["Athens","Thessaloniki","Patras","Heraklion","Larissa","Volos","Rhodes","Ioannina","Chania","Chalcis"],
  "Finland":         ["Helsinki","Espoo","Tampere","Vantaa","Oulu","Turku","Jyväskylä","Lahti","Kuopio","Kouvola"],
  "Kenya":           ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Nyeri","Machakos","Malindi","Kitale"],
  "Ghana":           ["Accra","Kumasi","Tamale","Ashaiman","Takoradi","Cape Coast","Obuasi","Tema","Sunyani","Koforidua"],
  "Ethiopia":        ["Addis Ababa","Dire Dawa","Mekelle","Gondar","Hawassa","Bahir Dar","Dessie","Jimma","Jijiga","Shashemene"],
  "Morocco":         ["Casablanca","Rabat","Fes","Marrakesh","Tangier","Agadir","Meknes","Oujda","Kenitra","Tetouan"],
  "Tanzania":        ["Dar es Salaam","Dodoma","Mwanza","Arusha","Mbeya","Morogoro","Tanga","Zanzibar City","Kigoma","Tabora"],
  "Uganda":          ["Kampala","Gulu","Lira","Mbarara","Jinja","Masaka","Kasese","Arua","Mbale","Entebbe"],
  "Rwanda":          ["Kigali","Butare","Gitarama","Musanze","Gisenyi","Byumba","Cyangugu","Nyanza","Ruhengeri"],
  "Senegal":         ["Dakar","Touba","Thiès","Rufisque","Kaolack","Mbour","Ziguinchor","Diourbel","Saint-Louis"],
  "Ivory Coast":     ["Abidjan","Bouaké","Daloa","Yamoussoukro","Korhogo","Man","Divo","Gagnoa","Abengourou","San-Pédro"],
  "Cameroon":        ["Douala","Yaoundé","Bamenda","Bafoussam","Garoua","Maroua","Ngaoundéré","Bertoua","Kumba","Nkongsamba"],
  "Zambia":          ["Lusaka","Kitwe","Ndola","Kabwe","Chingola","Mufulira","Livingstone","Luanshya","Kasama","Chipata"],
  "Zimbabwe":        ["Harare","Bulawayo","Chitungwiza","Mutare","Gweru","Kwekwe","Kadoma","Masvingo","Hwange","Chinhoyi"],
  "Israel":          ["Tel Aviv","Jerusalem","Haifa","Rishon LeZion","Petah Tikva","Ashdod","Netanya","Beer Sheva","Holon","Bnei Brak"],
  "Jordan":          ["Amman","Zarqa","Irbid","Russeifa","Wadi as-Seer","Aqaba","Madaba","Karak","Salt","Ramtha"],
  "Lebanon":         ["Beirut","Tripoli","Sidon","Tyre","Jounieh","Zahle","Nabatieh","Baalbek","Byblos","Aley"],
  "Iraq":            ["Baghdad","Basra","Mosul","Erbil","Sulaymaniyah","Kirkuk","Najaf","Karbala","Nasiriyah","Ramadi"],
  "Iran":            ["Tehran","Mashhad","Isfahan","Karaj","Shiraz","Tabriz","Ahvaz","Qom","Kermanshah","Rasht"],
  "Chile":           ["Santiago","Valparaíso","Concepción","Antofagasta","Viña del Mar","Temuco","Rancagua","Iquique","Talca","Arica"],
  "Peru":            ["Lima","Arequipa","Trujillo","Chiclayo","Piura","Iquitos","Cusco","Callao","Chimbote","Huancayo"],
  "Venezuela":       ["Caracas","Maracaibo","Valencia","Barquisimeto","Maracay","Ciudad Guayana","San Cristóbal","Maturín","Barcelona","Cumaná"],
  "Ecuador":         ["Guayaquil","Quito","Cuenca","Ambato","Santo Domingo","Portoviejo","Manta","Loja","Machala","Esmeraldas"],
  "Bolivia":         ["Santa Cruz","La Paz","Cochabamba","Oruro","Sucre","Potosí","El Alto","Tarija","Trinidad","Cobija"],
  "Paraguay":        ["Asunción","Ciudad del Este","San Lorenzo","Luque","Capiatá","Lambaré","Fernando de la Mora","Limpio","Ñemby"],
  "Uruguay":         ["Montevideo","Salto","Paysandú","Las Piedras","Rivera","Maldonado","Tacuarembó","Melo","Mercedes","Artigas"],
  "Mongolia":        ["Ulaanbaatar","Erdenet","Darkhan","Choibalsan","Mörön","Ulaangom","Khovd","Ölgii","Arvaikheer"],
};

/* ════════════════════════════════════════════════════════════════════════════
   INTERNATIONAL MAP LEADS INPUT
════════════════════════════════════════════════════════════════════════════ */
function IntlMapInput({ onSubmit }) {
  const [selectedNiche,  setSelectedNiche]  = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [country,        setCountry]        = useState("");
  const [province,       setProvince]       = useState("");
  const [city,           setCity]           = useState("");
  const [aiFilterOn,     setAiFilterOn]     = useState(false);
  const [aiFilterTxt,    setAiFilterTxt]    = useState("");
  const [error,          setError]          = useState("");
  const [isMobile,       setIsMobile]       = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const INTL_NICHES = [
    { value: "restaurant",    label: "Restaurant",    icon: "🍽️", count: "Global" },
    { value: "it",            label: "IT Company",    icon: "💻", count: "Global" },
    { value: "real-estate",   label: "Real Estate",   icon: "🏠", count: "Global" },
    { value: "hotel",         label: "Hotel",         icon: "🏨", count: "Global" },
    { value: "hospital",      label: "Hospital",      icon: "🏥", count: "Global" },
    { value: "gym",           label: "Gym / Fitness", icon: "💪", count: "Global" },
    { value: "law-firm",      label: "Law Firm",      icon: "⚖️", count: "Global" },
    { value: "school",        label: "School",        icon: "🎓", count: "Global" },
    { value: "retail",        label: "Retail Shop",   icon: "🛍️", count: "Global" },
    { value: "manufacturing", label: "Manufacturing", icon: "🏭", count: "Global" },
    { value: "other",         label: "Other",         icon: "📦", count: null },
  ];

  const POPULAR_COUNTRIES = ["UAE", "United States", "United Kingdom", "Australia", "Canada", "Singapore", "Germany", "Saudi Arabia"];

  const provinces = INTL_COUNTRY_STATES[country] || [];
  const cities    = INTL_STATE_CITIES[`${country}::${province}`] || INTL_STATE_CITIES[province] || INTL_COUNTRY_CITIES[country] || [];

  const filteredNiches = categorySearch.trim()
    ? INTL_NICHES.filter(n => n.label.toLowerCase().includes(categorySearch.toLowerCase()))
    : INTL_NICHES;

  const activeCategory = selectedNiche === "other"
    ? customCategory.trim()
    : selectedNiche ? (INTL_NICHES.find(n => n.value === selectedNiche)?.label || "") : "";

  const canSubmit = !!(activeCategory && country);

  return (
    <div style={{ display:"flex", flexDirection: isMobile ? "column-reverse" : "row", gap:18, alignItems:"flex-start" }}>

      {/* ── Left: inputs ── */}
      <div style={{ flex:"1 1 0%", display:"flex", flexDirection:"column", gap:18, minWidth:0 }}>

        {/* Category */}
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"18px 18px 16px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:12 }}>1. Choose Category *</div>
          <div style={{ position:"relative", marginBottom:14 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)", fontSize:13, pointerEvents:"none" }}>🔍</span>
            <input
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px 10px 36px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap:10 }}>
            {filteredNiches.map(n => {
              const active = selectedNiche === n.value;
              return (
                <button
                  key={n.value}
                  onClick={() => { setSelectedNiche(active ? null : n.value); setError(""); }}
                  style={{
                    position:"relative", display:"flex", flexDirection:"column", alignItems:"center",
                    gap:5, padding:"14px 8px 12px", borderRadius:12, cursor:"pointer", textAlign:"center",
                    border: active ? `2px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)",
                    background: active ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.03)",
                    color:"#fff", transition:"all 0.15s",
                  }}
                >
                  {active && (
                    <span style={{ position:"absolute", top:7, right:7, width:16, height:16, borderRadius:"50%", background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900 }}>✓</span>
                  )}
                  <span style={{ fontSize:22 }}>{n.icon}</span>
                  <span style={{ fontSize:12, fontWeight:700, lineHeight:1.3 }}>{n.label}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{n.count || "Explore more"}</span>
                </button>
              );
            })}
          </div>
          {selectedNiche === "other" && (
            <input
              value={customCategory} onChange={e => setCustomCategory(e.target.value)}
              placeholder="e.g. Dental Clinic, Wedding Planner, Interior Designer..."
              style={{ marginTop:12, width:"100%", ...inp }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          )}
        </div>

        {/* Location */}
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"18px 18px 16px" }}>
          <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", display:"block", marginBottom:12 }}>2. Choose Location *</span>
          <div style={{ position:"relative", marginBottom:12 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)", fontSize:13, pointerEvents:"none" }}>🌍</span>
            <select
              value={country}
              onChange={e => { setCountry(e.target.value); setProvince(""); setCity(""); setError(""); }}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px 10px 36px", color: country ? "#fff" : "rgba(255,255,255,0.4)", fontSize:13, outline:"none", boxSizing:"border-box", cursor:"pointer", colorScheme:"dark" }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            >
              <option value="">Select Country *</option>
              {[...INTL_COUNTRIES].sort((a,b) => a.localeCompare(b)).map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:12 }}>
            <span style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.4)", display:"block", marginBottom:8 }}>Popular Countries</span>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {POPULAR_COUNTRIES.map(c => (
                <button
                  key={c}
                  onClick={() => { setCountry(c); setProvince(""); setCity(""); setError(""); }}
                  style={{
                    padding:"5px 12px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600,
                    border: country === c ? `1.5px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)",
                    background: country === c ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)",
                    color: country === c ? T.accent : "rgba(255,255,255,0.6)",
                  }}
                >
                  {c}{country === c ? " ×" : ""}
                </button>
              ))}
            </div>
          </div>
          {country && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              <div>
                {provinces.length > 0 ? (
                  <select value={province} onChange={e => { setProvince(e.target.value); setCity(""); }} style={{ ...inp, cursor:"pointer", colorScheme:"dark" }}>
                    <option value="">State / Province</option>
                    {provinces.map(p => <option key={p} value={p} style={{ color:"#111", background:"#fff" }}>{p}</option>)}
                  </select>
                ) : (
                  <input value={province} onChange={e => setProvince(e.target.value)} placeholder="State / Province (optional)"
                    style={inp} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                )}
              </div>
              <div>
                {cities.length > 0 ? (
                  <select value={city} onChange={e => setCity(e.target.value)} style={{ ...inp, cursor:"pointer", colorScheme:"dark" }}>
                    <option value="">City (optional)</option>
                    {cities.map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
                  </select>
                ) : (
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="City (optional)"
                    style={inp} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                )}
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:8, alignItems:"center", background:"rgba(124,58,237,0.06)", borderRadius:8, padding:"8px 12px" }}>
            <span style={{ fontSize:13 }}>ℹ️</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>
              <strong style={{ color:T.accent }}>20 leads</strong> fetched per search · Real verified businesses worldwide from Google Maps.
            </span>
          </div>
        </div>

        {/* AI Filter */}
        <div style={{ border: aiFilterOn ? `1.5px solid ${T.accent}` : "1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"14px 16px", background: aiFilterOn ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.02)", transition:"all 0.2s" }}>
          <button onClick={() => setAiFilterOn(v => !v)} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:0, width:"100%" }}>
            <span style={{ fontSize:16 }}>🤖</span>
            <span style={{ fontSize:13, fontWeight:700, color: aiFilterOn ? T.accent : "rgba(255,255,255,0.75)" }}>AI Filter Mode</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginLeft:4 }}>(optional)</span>
            <span style={{ marginLeft:"auto", fontSize:12, color: aiFilterOn ? T.accent : "rgba(255,255,255,0.3)", fontWeight:700 }}>{aiFilterOn ? "ON ✓" : "OFF"}</span>
          </button>
          {aiFilterOn && (
            <textarea
              value={aiFilterTxt} onChange={e => setAiFilterTxt(e.target.value)}
              placeholder={"e.g. Only businesses without a website\ne.g. Only businesses with rating above 4.0\ne.g. Local independent shops only, no chains"}
              rows={3}
              style={{ width:"100%", marginTop:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit", lineHeight:1.6 }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
            />
          )}
        </div>

        {error && <div style={{ color:"#f87171", fontSize:13, padding:"0 4px" }}>{error}</div>}

        {/* CTA */}
        <PrimaryButton
          onClick={() => {
            if (!activeCategory) { setError("Business category is required"); return; }
            if (!country) { setError("Country is required"); return; }
            setError("");
            onSubmit(activeCategory, country, city, province, aiFilterOn && aiFilterTxt.trim() ? aiFilterTxt.trim() : "");
          }}
          disabled={!canSubmit}
        >
          {aiFilterOn && aiFilterTxt.trim() ? "🤖 Find & AI-Filter Leads" : "Find International Leads →"}
        </PrimaryButton>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {["✓ 20 leads per search", "✓ Google Maps verified", "✓ Global businesses", "✓ Export in CSV"].map(item => (
            <span key={item} style={{ fontSize:12, color:T.textMuted, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"4px 12px" }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── Right: preview panel ── */}
      <div style={{ flex: isMobile ? "1 1 100%" : "0 0 270px", width: isMobile ? "100%" : "auto", display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18 }}>
          <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:14 }}>What You'll Get</div>
          {["Business Name", "Phone Number", "Website", "Address", "Google Maps Rating", "Total Reviews", "Category"].map(item => (
            <div key={item} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9 }}>
              <span style={{ width:18, height:18, borderRadius:"50%", background:"rgba(124,58,237,0.18)", border:"1px solid rgba(124,58,237,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:T.accent, flexShrink:0, fontWeight:900 }}>✓</span>
              <span style={{ fontSize:13, color:"rgba(255,255,255,0.8)" }}>{item}</span>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ width:18, height:18, borderRadius:"50%", background:"rgba(124,58,237,0.18)", border:"1px solid rgba(124,58,237,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:T.accent, flexShrink:0, fontWeight:900 }}>✓</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.8)" }}>AI Outreach Message</span>
            <span style={{ marginLeft:4, fontSize:10, fontWeight:700, color:"#fff", background:T.accent, borderRadius:5, padding:"2px 6px" }}>NEW</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   INTERNATIONAL WEBSITE LEADS INPUT
════════════════════════════════════════════════════════════════════════════ */
function IntlWebInput({ onSubmit, quota }) {
  const [botStep,           setBotStep]          = useState(1);
  const [niche,             setNiche]            = useState("");
  const [nicheInput,        setNicheInput]       = useState("");
  const [country,           setCountry]          = useState("");
  const [city,              setCity]             = useState("");
  const [count,             setCount]            = useState(20);
  const [aiInstructions,    setAiInstructions]   = useState("");
  const [showAiInstructions,setShowAiInstructions]= useState(false);
  const [error,             setError]            = useState("");

  const NICHES = ["Restaurant owners","IT companies","CA firms","Real estate brokers","Hospital / Clinic owners","Coaching institutes","Hotel / Resort owners","Manufacturing companies","Interior designers","Wedding planners"];

  function handleNicheConfirm() {
    const n = nicheInput.trim() || niche.trim();
    if (!n) { setError("Business type required"); return; }
    setNiche(n); setError(""); setBotStep(2);
  }

  function handleFinalSubmit() {
    if (!niche.trim()) { setError("Business type required"); return; }
    if (!country) { setError("Country required"); return; }
    setError("");
    onSubmit(niche.trim(), country, city, count, aiInstructions.trim());
  }

  const wlQ = quota || { used: 0, remaining: 350, limit: 350 };

  return (
    <ToolCard>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#10b981,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🌐</div>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>International Website Leads</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Find verified contact details from business websites worldwide</div>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", marginBottom:20, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
        {[{n:1,label:"Niche",sub:"Business type"},{n:2,label:"Location",sub:"Country & city"},{n:3,label:"Confirm",sub:"Review & search"}].map((step,i) => (
          <div key={step.n} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:26, height:26, borderRadius:"50%",
                background: botStep>i+1?"#22c55e":botStep===i+1?T.accent:"rgba(255,255,255,0.08)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700,
                color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)", flexShrink:0 }}>
                {botStep>i+1?"✓":step.n}
              </div>
              <span style={{ fontSize:12, fontWeight:botStep===i+1?600:400, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>{step.label}</span>
            </div>
            {i<2 && <div style={{ flex:1, height:1, background:botStep>i+1?"rgba(34,197,94,0.4)":"rgba(255,255,255,0.1)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>

      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <input value={nicheInput} onChange={e => { setNicheInput(e.target.value); setError(""); }} onKeyDown={e => e.key==="Enter" && handleNicheConfirm()}
            placeholder="e.g. CA firms, Restaurant owners, IT companies..." autoFocus
            style={{ ...inp, fontSize:14 }} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {NICHES.map(s => (
              <button key={s} onClick={() => setNicheInput(s)}
                style={{ fontSize:11, padding:"4px 10px", borderRadius:20, cursor:"pointer",
                  background:nicheInput===s?"rgba(16,185,129,0.18)":"rgba(255,255,255,0.04)",
                  border:nicheInput===s?"1.5px solid #10b981":"1px solid rgba(255,255,255,0.1)",
                  color:nicheInput===s?"#10b981":"rgba(255,255,255,0.5)" }}>{s}</button>
            ))}
          </div>
          {error && <div style={{ color:"#f87171", fontSize:13 }}>{error}</div>}
          <PrimaryButton onClick={handleNicheConfirm} disabled={!nicheInput.trim() && !niche.trim()}>Next: Location →</PrimaryButton>
        </div>
      )}

      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <select value={country} onChange={e => { setCountry(e.target.value); setCity(""); }} style={{ ...inp, cursor:"pointer" }}>
              <option value="">Select Country *</option>
              {[...INTL_COUNTRIES].sort((a,b) => a.localeCompare(b)).map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
            </select>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City (optional)"
              style={inp} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
          </div>
          {error && <div style={{ color:"#f87171", fontSize:13 }}>{error}</div>}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
            <PrimaryButton onClick={() => { if (!country) { setError("Country required"); return; } setError(""); setBotStep(3); }} disabled={!country}>Next: Confirm →</PrimaryButton>
          </div>
        </div>
      )}

      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 18px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:8 }}>Search Summary</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>🎯 <strong style={{ color:"#fff" }}>Niche:</strong> {niche}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:4 }}>🌍 <strong style={{ color:"#fff" }}>Location:</strong> {[city, country].filter(Boolean).join(", ")}</div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>How many leads?</div>
            <div style={{ display:"flex", gap:8 }}>
              {[5,10,20].map(n => (
                <button key={n} onClick={() => setCount(n)} style={{ padding:"8px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                  background:count===n?`${T.accent}18`:"rgba(255,255,255,0.05)", border:`1.5px solid ${count===n?T.accent:"rgba(255,255,255,0.12)"}`,
                  color:count===n?T.accent:"rgba(255,255,255,0.55)" }}>{n}</button>
              ))}
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
            <button onClick={() => setShowAiInstructions(v=>!v)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.6)", fontSize:12 }}>
              <span style={{ display:"flex", alignItems:"center", gap:7 }}>⚙️ <span style={{ fontWeight:600 }}>Special Instructions</span><span style={{ fontSize:10, background:"rgba(124,58,237,0.2)", color:"#a78bfa", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>OPTIONAL</span></span>
              <span style={{ fontSize:10 }}>{showAiInstructions?"▲":"▼"}</span>
            </button>
            {showAiInstructions && (
              <div style={{ padding:"0 14px 14px" }}>
                <textarea value={aiInstructions} onChange={e => setAiInstructions(e.target.value)} rows={3}
                  placeholder="e.g. Only B2B companies, Only with email, Only with 50+ employees..."
                  style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontSize:12, padding:"10px 12px", resize:"vertical", outline:"none", lineHeight:1.6, boxSizing:"border-box" }} />
              </div>
            )}
          </div>
          {error && <div style={{ color:"#f87171", fontSize:13 }}>{error}</div>}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
            <PrimaryButton onClick={handleFinalSubmit}>🌐 Search Leads</PrimaryButton>
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>Wallet: ₹{(wlQ.balance || 0).toLocaleString("en-IN")} · ₹{wlQ.perLeadCost || 18}/lead · 5 leads per search</div>
        </div>
      )}
    </ToolCard>
  );
}

/* ── International Exporters / Importers Input ────────────────────────────── */
const INTL_EXIM_POP_PRODUCTS = ["Basmati Rice","Organic Tea","Cotton Yarn","Spices","Iron Ore","Textile Fabrics","Packaging Materials","Chemicals"];
const INTL_EXIM_POP_COUNTRIES = [
  { flag:"🇮🇳", name:"India" }, { flag:"🇺🇸", name:"United States" }, { flag:"🇦🇪", name:"United Arab Emirates" },
  { flag:"🇨🇳", name:"China" }, { flag:"🇧🇩", name:"Bangladesh" }, { flag:"🇻🇳", name:"Vietnam" }, { flag:"🇩🇪", name:"Germany" },
];

function IntlEximStepIndicator({ step }) {
  const steps = [
    { n:1, label:"Input",      sub:"Add your filters" },
    { n:2, label:"Processing", sub:"Finding & verifying leads" },
    { n:3, label:"Result",     sub:"Leads ready to export" },
  ];
  return (
    <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"14px 20px" }}>
      {steps.flatMap((s, i) => {
        const done   = s.n < step;
        const active = s.n === step;
        const items = [(
          <div key={`s${s.n}`} style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:34, height:34, borderRadius:"50%", flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:800, fontSize:13, transition:"all 0.3s",
              background: done ? T.success : active ? "linear-gradient(135deg,#7c3aed,#3b82f6)" : "rgba(255,255,255,0.06)",
              color: (done || active) ? "#fff" : "rgba(255,255,255,0.35)",
              border:`2px solid ${done ? T.success : active ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: active ? "0 0 18px rgba(124,58,237,0.35)" : "none",
            }}>
              {done ? "✓" : s.n}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color: active ? "#fff" : done ? T.success : "rgba(255,255,255,0.4)" }}>{s.label}</div>
              <div style={{ fontSize:11, color: active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}>{s.sub}</div>
            </div>
          </div>
        )];
        if (i < steps.length - 1) {
          items.push(<div key={`c${i}`} style={{ flex:1, height:2, background: done ? T.success : "rgba(255,255,255,0.07)", margin:"0 16px", borderRadius:2 }} />);
        }
        return items;
      })}
    </div>
  );
}

function IntlEximInput({ onSubmit }) {
  const [botStep,         setBotStep]         = useState(1);
  const [selectedCat,    setSelectedCat]    = useState("");
  const [product,        setProduct]        = useState("");
  const [productInput,   setProductInput]   = useState("");
  const [tradeType,      setTradeType]      = useState("importer");
  const [selectedCountry,setSelectedCountry]= useState("");
  const [selectedCity,   setSelectedCity]   = useState("");
  const [hsCode,         setHsCode]         = useState("");
  const [error,          setError]          = useState("");

  function handleStep1() {
    const p = productInput.trim() || product.trim();
    if (!p) { setError("Product required"); return; }
    setProduct(p); setError(""); setBotStep(2);
  }

  function handleSubmit() {
    const p = product.trim();
    if (!p) { setError("Product required"); return; }
    if (!selectedCountry) { setError("Please select a country"); return; }
    setError("");
    onSubmit(p, tradeType, selectedCountry, selectedCity, hsCode.trim());
  }

  const INTL_CATS = [
    { cat:"Agriculture & Food",  products:["Basmati Rice","Spices","Tea","Coffee","Wheat","Seafood","Mango","Cotton","Sugar"] },
    { cat:"Textiles & Apparel",  products:["Cotton Yarn","Garments","Silk Fabric","Leather Goods","Footwear","Jute"] },
    { cat:"Chemicals & Pharma",  products:["Pharmaceuticals","Dyes","Agrochemicals","Fertilizers","Plastic Granules","Cosmetics"] },
    { cat:"Engineering & Metal", products:["Steel Products","Aluminium","Auto Components","Machinery","Electronic Parts","Hand Tools"] },
    { cat:"Gems & Jewellery",    products:["Cut Diamonds","Gold Jewellery","Silver Jewellery","Precious Stones"] },
    { cat:"IT & Electronics",    products:["Software Services","IT Hardware","Electronic Goods","Solar Panels","LED Products"] },
    { cat:"Handicrafts & Home",  products:["Handicrafts","Carpets","Marble","Granite","Ceramics","Glassware","Furniture"] },
  ];

  const activeCat = INTL_CATS.find(c => c.cat === selectedCat);

  return (
    <ToolCard>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"rgba(124,58,237,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌐</div>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>International Exporters / Importers</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>ImportYeti (US Customs) • Volza (Global Trade) • Alibaba • 6-digit HS codes • USD/EUR</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", marginBottom:22, padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
        {["Category & Product","Trade Type & Country","Confirm"].map((label,i) => (
          <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background: botStep>i+1?"#22c55e":botStep===i+1?T.accent:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.3)" }}>{botStep>i+1?"✓":i+1}</div>
              <span style={{ fontSize:11, fontWeight:botStep===i+1?600:400, color:botStep>=i+1?"#fff":"rgba(255,255,255,0.35)", whiteSpace:"nowrap" }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)", margin:"0 8px" }} />}
          </div>
        ))}
      </div>
      {botStep === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Which product do you want to find international trade leads for?</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Choose a category or type a product directly</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
              {INTL_CATS.map(c => (
                <button key={c.cat} onClick={() => setSelectedCat(c.cat === selectedCat ? "" : c.cat)}
                  style={{ fontSize:11, padding:"4px 10px", borderRadius:20, cursor:"pointer",
                    background: selectedCat===c.cat?"rgba(124,58,237,0.18)":"rgba(255,255,255,0.04)",
                    border: selectedCat===c.cat?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                    color: selectedCat===c.cat?T.accent:"rgba(255,255,255,0.55)" }}>{c.cat}</button>
              ))}
            </div>
            {activeCat && (
              <div style={{ marginBottom:10, padding:"8px 12px", background:"rgba(124,58,237,0.06)", borderRadius:8, border:"1px solid rgba(124,58,237,0.15)" }}>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {activeCat.products.map(p => (
                    <button key={p} onClick={() => setProductInput(p)}
                      style={{ fontSize:11, padding:"3px 8px", borderRadius:16, cursor:"pointer",
                        background: productInput===p?"rgba(124,58,237,0.2)":"rgba(255,255,255,0.05)",
                        border: productInput===p?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                        color: productInput===p?T.accent:"rgba(255,255,255,0.6)" }}>{p}</button>
                  ))}
                </div>
              </div>
            )}
            <input value={productInput} onChange={e => { setProductInput(e.target.value); setError(""); }}
              onKeyDown={e => e.key==="Enter" && handleStep1()} autoFocus
              placeholder="e.g. Basmati Rice, Pharmaceuticals, Steel, Cotton Yarn..."
              style={{ ...inp, fontSize:14, marginBottom:8 }}
              onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            <input value={hsCode} onChange={e => setHsCode(e.target.value)}
              placeholder="HS Code (optional, 6-digit international)"
              style={{ ...inp, fontSize:12, marginBottom:10 }}
              onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <PrimaryButton onClick={handleStep1} disabled={!productInput.trim()}>Next: Trade Type →</PrimaryButton>
          </div>
        </div>
      )}
      {botStep === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:8, alignItems:"center" }}>
            <div style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"12px 4px 12px 12px", padding:"7px 13px" }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.accent }}>{product}</span>
            </div>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>👤</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"10px 14px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>Trade type + Country</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Importer ya Exporter? Kaunsa country?</div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[{v:"importer",l:"Importer 📥"},{v:"exporter",l:"Exporter 🚀"},{v:"both",l:"Both 🔄"}].map(t => (
                <button key={t.v} onClick={() => setTradeType(t.v)}
                  style={{ flex:1, padding:"9px 6px", borderRadius:10, cursor:"pointer",
                    background: tradeType===t.v?"rgba(124,58,237,0.18)":"rgba(255,255,255,0.04)",
                    border: tradeType===t.v?`1.5px solid ${T.accent}`:"1px solid rgba(255,255,255,0.1)",
                    color: tradeType===t.v?T.accent:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:700 }}>{t.l}</button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} style={{ ...inp, cursor:"pointer" }}>
                <option value="">Select Country *</option>
                {[...INTL_COUNTRIES].sort((a,b) => a.localeCompare(b)).map(c => <option key={c} value={c} style={{ color:"#111", background:"#fff" }}>{c}</option>)}
              </select>
              <input value={selectedCity} onChange={e => setSelectedCity(e.target.value)} placeholder="City (optional)"
                style={{ ...inp }} onFocus={e => e.target.style.borderColor=T.accent} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            </div>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(1)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={() => setBotStep(3)}>Next: Confirm →</PrimaryButton>
            </div>
          </div>
        </div>
      )}
      {botStep === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:"4px 12px 12px 12px", padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:8 }}>Confirm - ready to start the search?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🌐 <strong style={{ color:"#fff" }}>Product:</strong> {product}{hsCode?` (HS: ${hsCode})`:""}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>🚢 <strong style={{ color:"#fff" }}>Type:</strong> {tradeType}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>📍 <strong style={{ color:"#fff" }}>Country:</strong> {[selectedCity,selectedCountry].filter(Boolean).join(", ")}</div>
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"rgba(124,58,237,0.7)" }}>
                📊 You'll get: Annual turnover (USD) • Certifications (ISO/CE/FDA) • Shipment history • Contact • WhatsApp
              </div>
            </div>
          </div>
          <div style={{ paddingLeft:44 }}>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:8 }}>{error}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setBotStep(2)} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)" }}>← Back</button>
              <PrimaryButton onClick={handleSubmit}>🌐 Find International Traders</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

function IntlEximProcessing({ product, tradeType, country, city }) {
  const typeLabel = tradeType === "exporter" ? "Exporters" : tradeType === "importer" ? "Importers" : "Exporters & Importers";
  const location = city ? `${city}, ${country}` : country;
  return (
    <ToolCard style={{ textAlign:"center", padding:"64px 32px" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", border:`3px solid rgba(124,58,237,0.2)`, borderTopColor:T.accent, animation:"spin 0.9s linear infinite", margin:"0 auto 28px" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:8 }}>Searching for international trade leads...</div>
      <div style={{ fontSize:13, color:T.textMuted, marginBottom:24 }}>
        <strong style={{ color:T.accent }}>{product}</strong> · <strong style={{ color:T.accent }}>{typeLabel}</strong> · {location}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:400, margin:"0 auto" }}>
        {[
          "🔍 Scanning ImportYeti US Customs data",
          "📦 Checking Panjiva & Volza global shipment records",
          "🌐 Searching international trade directories",
          "🤖 MyThinkAI extracting company contacts, HS codes, and trade history",
          "📊 Scoring and verifying leads",
        ].map(item => (
          <div key={item} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 16px", fontSize:13, color:T.textMuted, textAlign:"left" }}>
            {item}
          </div>
        ))}
      </div>
    </ToolCard>
  );
}
export {
  INTL_COUNTRY_STATES, INTL_STATE_CITIES, INTL_COUNTRY_CITIES,
  IntlMapInput, IntlWebInput,
  IntlEximStepIndicator, IntlEximInput, IntlEximProcessing,
};

