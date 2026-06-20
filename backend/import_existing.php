<?php
require_once __DIR__ . '/config.php';

$portfolioData = [
    ['category'=>'prewedding','image_path'=>'images/portfolio/pre/DSC_2265.jpg','title'=>'Romantic Sunset','alt'=>'Romantic Sunset'],
    ['category'=>'prewedding','image_path'=>'images/portfolio/pre/DSC_2316.jpg','title'=>'Golden Hour Love','alt'=>'Golden Hour Love'],
    ['category'=>'prewedding','image_path'=>'images/portfolio/pre/DSC_2437.jpg','title'=>'Eternal Bond','alt'=>'Eternal Bond'],
    ['category'=>'prewedding','image_path'=>'images/portfolio/pre/DSC_2486.jpg','title'=>'Love in Bloom','alt'=>'Love in Bloom'],
    ['category'=>'babyshoot','image_path'=>'images/portfolio/baby1.jpg','title'=>'Newborn Shoot','alt'=>'Newborn Shoot'],
    ['category'=>'wedding','image_path'=>'images/wd/DSC08104.jpg','title'=>'Wedding 01','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/DSC08114.jpg','title'=>'Wedding 03','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/DSC08121.jpg','title'=>'Wedding 05','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/groom/DSC_2741.jpg','title'=>'Groom 01','alt'=>'Groom'],
    ['category'=>'wedding','image_path'=>'images/wd/groom/DSC_2763.jpg','title'=>'Groom 03','alt'=>'Groom'],
    ['category'=>'wedding','image_path'=>'images/wd/groom/DSC_2822.jpg','title'=>'Groom 05','alt'=>'Groom'],
    ['category'=>'wedding','image_path'=>'images/wd/groom/DSC_2865.jpg','title'=>'Groom 07','alt'=>'Groom'],
    ['category'=>'wedding','image_path'=>'images/wd/groom/_DSC7446.jpg','title'=>'Groom 09','alt'=>'Groom'],
    ['category'=>'wedding','image_path'=>'images/wd/groom/_DSC7495-Recovered-2.jpg','title'=>'Groom 11','alt'=>'Groom'],
    ['category'=>'wedding','image_path'=>'images/wd/groom/_DSC7594.jpg','title'=>'Groom 13','alt'=>'Groom'],
    ['category'=>'wedding','image_path'=>'images/wd/groom/_DSC7627.jpg','title'=>'Groom 15','alt'=>'Groom'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_3665.jpg','title'=>'Wedding 101','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_3689.jpg','title'=>'Wedding 102','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_3709.jpg','title'=>'Wedding 103','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_3725.jpg','title'=>'Wedding 104','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_3737.jpg','title'=>'Wedding 105','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_3744.jpg','title'=>'Wedding 106','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_3751.jpg','title'=>'Wedding 107','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_5448.jpg','title'=>'Wedding 108','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_5452.jpg','title'=>'Wedding 109','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_5474.jpg','title'=>'Wedding 110','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_5490.jpg','title'=>'Wedding 111','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_6251.jpg','title'=>'Wedding 112','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_6265.jpg','title'=>'Wedding 113','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_6272.jpg','title'=>'Wedding 114','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_6280.jpg','title'=>'Wedding 115','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_6328.jpg','title'=>'Wedding 116','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_6341.jpg','title'=>'Wedding 117','alt'=>'Wedding'],
    ['category'=>'wedding','image_path'=>'images/wd/w10/DSC_6341b.jpg','title'=>'Wedding 118','alt'=>'Wedding'],
    ['category'=>'babyshoot','image_path'=>'images/portfolio/baby123/DSC_1949.jpg','title'=>'Baby Bliss','alt'=>'Baby Bliss'],
    ['category'=>'babyshoot','image_path'=>'images/portfolio/baby123/DSC_1950.jpg','title'=>'Little Angel','alt'=>'Little Angel'],
    ['category'=>'babyshoot','image_path'=>'images/portfolio/baby123/DSC_1951.jpg','title'=>'Cutie Pie','alt'=>'Cutie Pie'],
    ['category'=>'babyshoot','image_path'=>'images/portfolio/baby123/DSC_1962.jpg','title'=>'Baby Love','alt'=>'Baby Love'],
    ['category'=>'babyshoot','image_path'=>'images/portfolio/baby123/DSC_2000.jpg','title'=>'Baby Giggles','alt'=>'Baby Giggles'],
    ['category'=>'babyshoot','image_path'=>'images/portfolio/baby123/DSC_2111.jpg','title'=>'Happy Baby','alt'=>'Happy Baby'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9769.JPG.jpg','title'=>'Baby Shower 01','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9771.jpg','title'=>'Baby Shower 02','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9786.jpg','title'=>'Baby Shower 03','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9791.jpg','title'=>'Baby Shower 04','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9796.jpg','title'=>'Baby Shower 05','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9799.jpg','title'=>'Baby Shower 06','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9804.jpg','title'=>'Baby Shower 07','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9806.jpg','title'=>'Baby Shower 08','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9813.jpg','title'=>'Baby Shower 09','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9821.jpg','title'=>'Baby Shower 10','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9824.jpg','title'=>'Baby Shower 11','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9835.jpg','title'=>'Baby Shower 12','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9875.jpg','title'=>'Baby Shower 13','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9886.jpg','title'=>'Baby Shower 14','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9888.jpg','title'=>'Baby Shower 15','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9904.jpg','title'=>'Baby Shower 16','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9909.jpg','title'=>'Baby Shower 17','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9920.jpg','title'=>'Baby Shower 18','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9924.jpg','title'=>'Baby Shower 19','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9931.jpg','title'=>'Baby Shower 20','alt'=>'Baby Shower'],
    ['category'=>'babyshower','image_path'=>'images/portfolio/BABY SHOWER/DSC_9932.jpg','title'=>'Baby Shower 21','alt'=>'Baby Shower'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_7825.jpg','title'=>'Model Shoot 01','alt'=>'Model Shoot'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_7834.jpg','title'=>'Model Shoot 02','alt'=>'Model Shoot'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_7836.jpg','title'=>'Model Shoot 03','alt'=>'Model Shoot'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_7851.jpg','title'=>'Model Shoot 05','alt'=>'Model Shoot'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_7860.jpg','title'=>'Model Shoot 08','alt'=>'Model Shoot'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_7868.jpg','title'=>'Model Shoot 10','alt'=>'Model Shoot'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_7939.jpg','title'=>'Model Shoot 15','alt'=>'Model Shoot'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_8104.jpg','title'=>'Model Shoot 20','alt'=>'Model Shoot'],
    ['category'=>'modelshoot','image_path'=>'images/portfolio/modelshoot/DSC_8118.jpg','title'=>'Model Shoot 24','alt'=>'Model Shoot'],
];

$videoData = [
    ['title'=>'Wedding Highlight Reel','category'=>'Cinematic Wedding Film','youtube_url'=>'https://youtu.be/dT3SDhxHYPY'],
    ['title'=>'Wedding Reel','category'=>'Short Film','youtube_url'=>'https://youtu.be/hU3jRz2CyXs'],
    ['title'=>'Drone Shoot','category'=>'Aerial Cinematography','youtube_url'=>'https://youtu.be/uPvUZ7n6YqM'],
    ['title'=>'Drone Shoot 2','category'=>'Aerial Cinematography','youtube_url'=>'https://youtu.be/OX898Nr0f5g'],
    ['title'=>'Bride Shoot','category'=>'Bridal Film','youtube_url'=>'https://youtu.be/FqGUNMFWAC4'],
    ['title'=>'Wedding Teaser','category'=>'Cinematic Teaser','youtube_url'=>'https://youtu.be/2M5nLZ8EB24'],
    ['title'=>'Pre-Wedding Film','category'=>'Pre-Wedding Love Story','youtube_url'=>'https://youtu.be/opPxhntwMCQ'],
    ['title'=>'Birthday Celebration','category'=>'Event Recap','youtube_url'=>'https://youtu.be/PTRvPU2ziSo'],
    ['title'=>'Pre-Wedding Love Story','category'=>'Short Film','youtube_url'=>'https://youtu.be/e_8UWhTfjbI'],
];

try {
    $pdo = getDB();
    echo "<h2>Importing Portfolio Items...</h2>";
    $stmt = $pdo->prepare("INSERT IGNORE INTO portfolio_items (category, image_path, title, alt_text) VALUES (?, ?, ?, ?)");
    $count = 0;
    foreach ($portfolioData as $item) { $stmt->execute([$item['category'], $item['image_path'], $item['title'], $item['alt']]); if ($stmt->rowCount()) $count++; }
    echo "<p>✓ Imported $count new portfolio items.</p>";
    echo "<h2>Importing Videos...</h2>";
    $stmt = $pdo->prepare("INSERT IGNORE INTO videos (title, category, youtube_url) VALUES (?, ?, ?)");
    $count = 0;
    foreach ($videoData as $v) { $stmt->execute([$v['title'], $v['category'], $v['youtube_url']]); if ($stmt->rowCount()) $count++; }
    echo "<p>✓ Imported $count new videos.</p>";
    echo "<p style='color:green;font-weight:bold;'>Done! Delete import_existing.php now.</p>";
} catch (Exception $e) { echo "<p style='color:red;'>Error: " . htmlspecialchars($e->getMessage()) . "</p>"; }
