const fs = require('fs');

const replacements = {
  'https://picsum.photos/seed/hanauma/400/300': 'https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/diamondhead/400/300': 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/pearlharbor/400/300': 'https://images.unsplash.com/photo-1580910863076-26e5e8e84180?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/kahana/400/300': 'https://images.unsplash.com/photo-1518182170546-076616fdcbac?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/keaiwa/400/300': 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/kaena/400/300': 'https://images.unsplash.com/photo-1515861461225-1488dfdaf0a8?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/malaekahana/400/300': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/pali/400/300': 'https://images.unsplash.com/photo-1554188248-986adbb7329d?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/sandisland/400/300': 'https://images.unsplash.com/photo-1509233725247-49e11bf8124c?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/bishopmuseum/400/300': 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/homa/400/300': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/pcc/400/300': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/foster/400/300': 'https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/haleakala/400/300': 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/iaovalley/400/300': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/waianapanapa/400/300': 'https://images.unsplash.com/photo-1600208537475-6cb31725581b?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/palaau/400/300': 'https://images.unsplash.com/photo-1599423423926-a9d20f04dc22?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/makena/400/300': 'https://images.unsplash.com/photo-1564500601339-4d614b8273c5?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/polipoli/400/300': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/puakaa/400/300': 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/mauihistory/400/300': 'https://images.unsplash.com/photo-1551008475-4533d141425e?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/kulagarden/400/300': 'https://images.unsplash.com/photo-1460533893735-45cea2212645?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/volcano/400/300': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/akaka/400/300': 'https://images.unsplash.com/photo-1546948630-1149ea60dc86?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/honaunau/400/300': 'https://images.unsplash.com/photo-1568283094545-b530510f2746?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/hapuna/400/300': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/kalopa/400/300': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/kekahakai/400/300': 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/kealakekua/400/300': 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/lapakahi/400/300': 'https://images.unsplash.com/photo-1533651180995-1b8b7d903063?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/lavatree/400/300': 'https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/wailuku/400/300': 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/lyman/400/300': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/htbg/400/300': 'https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/waimea/400/300': 'https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/haena/400/300': 'https://images.unsplash.com/photo-1518182170546-076616fdcbac?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/kokee/400/300': 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/wailua/400/300': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/polihale/400/300': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/ahukini/400/300': 'https://images.unsplash.com/photo-1515861461225-1488dfdaf0a8?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/paulaula/400/300': 'https://images.unsplash.com/photo-1533651180995-1b8b7d903063?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/kauaimuseum/400/300': 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=400&h=300&q=80',
  'https://picsum.photos/seed/allerton/400/300': 'https://images.unsplash.com/photo-1460533893735-45cea2212645?auto=format&fit=crop&w=400&h=300&q=80'
};

let content = fs.readFileSync('src/App.tsx', 'utf8');

for (const [oldUrl, newUrl] of Object.entries(replacements)) {
  content = content.replace(oldUrl, newUrl);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Images replaced successfully.');
