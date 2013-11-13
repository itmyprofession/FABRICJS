<?php

define('DS', DIRECTORY_SEPARATOR);
$imageData = $_POST['image-data'];

echo "<img src='$imageData'>";

$data = base64_decode(str_replace(' ', '+', substr($_POST['image-data'], 22)));

$img = imagecreatefromstring($data);

$w = imagesx($img);
$h = imagesy($img);

$alpha_image = imagecreatetruecolor($w, $h);

$red = imagecolorallocate($alpha_image, 255, 0, 0);
$black = imagecolorallocate($alpha_image, 0, 0, 0);

// Make the background transparent
imagecolortransparent($alpha_image, $black);

imagecopyresampled($alpha_image, $img, 0, 0, 0, 0, $w, $h, $w, $h);
imagepng($img, 'test.png', 0);

imagedestroy($img);
