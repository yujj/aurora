<?php

if(isset($_POST['ftp_action'])){
	if (!isset($_SESSION['user-id'])) {
		echo '{false}';
		exit();
	}
	include_once('ftp/ftp.class.php');
	if($_POST['ftp_action'] == 'connect' || 1){
		$ftp_data = $_POST['ftp_data'];
		$server = $ftp_data['host'];
		$project = $ftp_data['project'];
		$port = isset($ftp_data['port'])?$ftp_data['port']:'21';
		$user = $ftp_data['login'];
		$password = $ftp_data['password'];
		$passive = !(isset($ftp_data['mode']) && $ftp_data['mode'] == 'active');
		$currentDir = (isset($ftp_data['path'])?$ftp_data['path']:'/');
		$ftp = new ftp($server, $port, $user, $password, $passive);
		$ftp->setCurrentDir($currentDir);
		if($_POST['ftp_action'] == 'connect') echo "loggedOn: ".$ftp->loggedOn;
		elseif($_POST['ftp_action'] == 'load'){
			$file = $_POST['ftp_filename'];
			$s = $ftp->download($file);
			if($s !== false){
				$bakfname = 'backups/'.$project.'/'.$file.'.'.date('Y-m-d_H:i').'_'.$_SERVER['REMOTE_ADDR'].'r.txt';
				$bakfdir = dirname($bakfname);
				mkdir($bakfdir, 0777, true);
				if(!file_exists($bakfname)){
					file_put_contents($bakfname, $s);
				}
				$encoding = $_POST['ftp_encoding'];
				if($encoding != 'utf8'){
					$s = iconv('windows-1251', 'utf-8', $s);
				}
				echo $s;
			}else{
				echo '{false}';
			}
		}elseif($_POST['ftp_action'] == 'upload'){
			$file = $_POST['ftp_filename'];
			$encoding = $_POST['ftp_encoding'];
			$s = $_POST['ftp_stream'];
			if($encoding != 'utf8'){
				$s = iconv('utf-8', 'windows-1251', $s);
			}
			$bakfname = 'backups/'.$project.'/'.$file.'.'.date('Y-m-d_H:i').'_'.$_SERVER['REMOTE_ADDR'].'w.txt';
			$bakfdir = dirname($bakfname);
			mkdir($bakfdir, 0777, true);
			if(!file_exists($bakfname)){
				file_put_contents($bakfname, $s);
			}
			$ok = $ftp->upload($file, $s);
			echo ($ok?"{true}":"{false}");
		}
	}else{
	}
	exit();
}

