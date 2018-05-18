<?php

$settings = array(
	'admin_emails' => array(
		'hideki@ptyapp.com',
		'kouki5833@yahoo.co.jp',
	),
	'webservice_email' => 'webmaster@ptyapp.com',
);

$version = '2012062900';

function init() {
	mb_language('uni');
	mb_internal_encoding('utf-8');
}

function check_referer() {
	return preg_match('', $_SERVER['HTTP_REFERER']);
}

function send_mail() {
	global $settings;

	$email_to = preg_replace('/[^\x20-\x7e]+/', '', $_POST['emailTo']);
	$payload = $_POST['body'];

	$subject = mb_encode_mimeheader('お問い合わせを受け付けました');

	$body = implode("\n", array(
		'お問い合わせを正常に受信いたしました。回答までしばらくお待ちくださいませ。',
		'',
		$payload,
		'',
		'-----',
		"フォーム送信ウェブサービス <${settings['webservice_email']}>",
	));

	$headers = implode("\x0D\x0A", array(
		"From: ${settings['webservice_email']}",
		'Cc: ' . implode(', ', $settings['admin_emails']),
		"Reply-To: <$email_to>",
		'Content-Type: text/plain; charset=utf-8',
		'Content-Transfer-Encoding: base64',
		'X-Mailer: PHP/' . phpversion(),
	));

	return mail($email_to, $subject, base64_encode($body), $headers, "-f${settings['webservice_email']}");
}

function main() {
	global $version;

	init();

	if (isset($_REQUEST['dry'])) {
		header('Content-Type: text/plain; charset=utf-8');
		echo 'ok';
		return;
	}

	if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
		if (send_mail()) {
			header('Content-Type: text/plain; charset=utf-8');
			echo 'ok';
		} else {
			header('Status: 403');
			header('Content-Type: text/plain; charset=utf-8');
			echo 'mailing failed';
		}
	} else {
		header('Content-Type: text/plain; charset=utf-8');
		echo "sendmail-api.php/$version";
	}
}

main();
