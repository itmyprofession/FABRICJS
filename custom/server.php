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
/*
$overlay = 'image' . DS . 'template' . DS . 'white-front.png';
$jpeg = 'image/test.png';
echo $_POST['image-data'];
$data = base64_decode(str_replace(' ', '+', substr($_POST['image-data'], 22)));
$img = imagecreatefromstring($data);
$w = imagesx($img);
$h = imagesy($img);
$alpha_image = imagecreatetruecolor($w, $h);
imagecopyresampled($alpha_image, $img, 0, 0, 0, 0, $w, $h, $w, $h);
imagepng($img, 'test.png', 0);
imagedestroy($img);

// PHP
$imageData = $_POST['image-data'];
echo "<img src='$imageData'/>";
$extension = $_POST['image-extension'];
$imageData = str_replace("data:image/" . $extension . ";base64,", "", $imageData);
$filename = uniqid() . "." . $extension;
$data = base64_encode($imageData);
file_put_contents($filename, $data);

//$png = imagecreatefrompng($overlay); // your design from above saved image
//$jpeg = imagecreatefrompng($jpeg); // your T-shirt image
//
//list($width, $height) = getimagesize($overlay);
//list($width2, $height2) = getimagesize($jpeg);
//
////$x =; // design position x in T-shirt
////$y =; // design position y in T-shirt
//
//$out = imagecreatetruecolor($width2, $height2);
//imagecopyresampled($out, $jpeg, 0, 0, 0, 0, $width2, $height2, $width2, $height2);
//imagecopyresampled($out, $png, $x, $y, 0, 0, $width, $height, $width, $height);
//
//$final = 'image' . DS . 'preview' . DS . $filename;
//
//imagejpeg($out, $final, 100); // $final = "/..../your final image file name";
 * 
 */