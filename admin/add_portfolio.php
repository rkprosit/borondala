<?php require_once __DIR__ . '/auth.php'; requireLogin(); require_once __DIR__ . '/../backend/config.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $category = $_POST['category'] ?? ''; $image_path = '';
    if (!empty($_FILES['image']['name'])) {
        $targetDir = __DIR__ . '/../images/portfolio/';
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $_FILES['image']['name']);
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetDir . $filename)) $image_path = 'images/portfolio/' . $filename;
    } elseif (!empty($_POST['image_path'])) { $image_path = $_POST['image_path']; }
    if ($image_path) {
        try { $pdo = getDB(); $stmt = $pdo->prepare("INSERT INTO portfolio_items (category, image_path, title, alt_text, display_order) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$category, $image_path, $_POST['title'] ?? '', $_POST['alt_text'] ?? '', intval($_POST['display_order'] ?? 0)]);
            $_SESSION['flash'] = ['type' => 'success', 'message' => 'Portfolio item added!']; } catch (Exception $e) { $_SESSION['flash'] = ['type' => 'error', 'message' => 'Error: ' . $e->getMessage()]; }
    } else { $_SESSION['flash'] = ['type' => 'error', 'message' => 'Please provide an image.']; }
    header('Location: index.php'); exit;
}
$categories = ['wedding','prewedding','babyshoot','babyshower','modelshoot','events'];
?><!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Add Portfolio</title><link rel="stylesheet" href="style.css"></head><body><div class="navbar"><h2>Add Portfolio Item</h2><a href="index.php">&larr; Back</a></div><div class="container"><div class="form-card"><form method="POST" enctype="multipart/form-data"><div class="form-row"><select name="category" required><option value="">Category</option><?php foreach ($categories as $cat): ?><option value="<?= $cat ?>"><?= ucfirst($cat) ?></option><?php endforeach; ?></select><input type="number" name="display_order" placeholder="Order" value="0"></div><input type="text" name="title" placeholder="Title" required><input type="text" name="alt_text" placeholder="Alt text"><input type="text" name="image_path" placeholder="Or enter existing path"><input type="file" name="image" accept="image/*"><p style="font-size:.75rem;color:#666;margin-bottom:12px;">Upload new image OR enter existing path above.</p><button type="submit" class="btn">Add</button></form></div></div></body></html>
