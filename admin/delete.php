<?php require_once __DIR__ . '/auth.php'; requireLogin(); require_once __DIR__ . '/../backend/config.php';
$type = $_GET['type'] ?? ''; $id = intval($_GET['id'] ?? 0);
if (!$id || !in_array($type, ['portfolio','video','contact','estimate'])) { header('Location: index.php'); exit; }
try { $pdo = getDB();
    if ($type === 'portfolio') { $stmt = $pdo->prepare("SELECT image_path FROM portfolio_items WHERE id = ?"); $stmt->execute([$id]); $item = $stmt->fetch(); if ($item && $item['image_path']) { $f = __DIR__ . '/../' . $item['image_path']; if (file_exists($f)) unlink($f); }
        $pdo->prepare("DELETE FROM portfolio_items WHERE id = ?")->execute([$id]); }
    elseif ($type === 'video') $pdo->prepare("DELETE FROM videos WHERE id = ?")->execute([$id]);
    elseif ($type === 'contact') $pdo->prepare("DELETE FROM contacts WHERE id = ?")->execute([$id]);
    elseif ($type === 'estimate') $pdo->prepare("DELETE FROM estimates WHERE id = ?")->execute([$id]);
    $_SESSION['flash'] = ['type' => 'success', 'message' => 'Deleted.']; }
catch (Exception $e) { $_SESSION['flash'] = ['type' => 'error', 'message' => 'Error: ' . $e->getMessage()]; }
header('Location: index.php'); exit;
