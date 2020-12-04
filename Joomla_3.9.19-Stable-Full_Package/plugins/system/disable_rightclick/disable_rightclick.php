<?php

 /**
 * @package Custom Right Click for Joomla! 3.X
 * @version $Id: custom_rightclick.php 2015-01-12 11:00:00Z  $
 * @author Glimlag.gr
 * @copyright (C) 2015- Glimlag.gr
 * @license GNU/GPLv2 http://www.gnu.org/licenses/gpl-2.0.html
**/

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

// Import library dependencies
jimport( 'joomla.plugin.plugin' );

class plgSystemDisable_rightclick extends JPlugin {
	
public function __construct( &$subject, $config )
{
parent::__construct( $subject, $config );
 
// Do some extra initialisation in this constructor if required
}

	function onAfterRender() {

		$app = JFactory::getApplication();
		$document = JFactory::getDocument();
		if($app->isAdmin()) return;

		$html = JResponse::getBody();
		$user = JFactory::getUser();
		$user_groups = $user->getAuthorisedGroups();
		$restricted_groups = $this->params->get('groups', array());
		$title = $this->params->get('popup_title');
		$message = $this->params->get('popup_message');
		settype($restricted_groups, 'array');

		// Set Permission
		if(count(array_diff($user_groups, $restricted_groups)) == 0) {

			// Show Popup Message
			$show_popup = $this->params->get('show_popup');

			// Disable Right Click
			switch($this->params->get('disable_rightclick')){
				case 0:
					break;
				case 1:
					$right_click = "
<script type=\"text/javascript\">
var show_popup=".$show_popup.";
jQuery(document).bind(\"contextmenu\", function(e) { if (show_popup==0) e.preventDefault(); else {e.preventDefault();jQuery('#openModal').css('opacity','1');jQuery('#openModal').css('pointer-events','auto');} });
jQuery(document).ready(function() {
    jQuery(document).on(\"click\",\"#close\",function() {
        jQuery('#openModal').css('opacity','0');
        jQuery('#openModal').css('pointer-events','none');
    });
});
</script>";
$popup = '<div id="openModal" class="modalDialog">
	<div>
		<a href="#close" title="Close" id="close" class="close">X</a>
		<h2>'.$title.'</h2>
		<p>'.$message.'</p>
	</div>
</div>';
$style = '<style type="text/css">
	.modalDialog {
	position: fixed;
	font-family: Arial, Helvetica, sans-serif;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0,0,0,0.8);
	z-index: 99999;
	opacity:0;
	-webkit-transition: opacity 400ms ease-in;
	-moz-transition: opacity 400ms ease-in;
	transition: opacity 400ms ease-in;
pointer-events: none;
}

.modalDialog:target {
	opacity:1;
	pointer-events: auto;
}

.modalDialog > div {
	width: 400px;
	position: relative;
	margin: 10% auto;
	padding: 5px 20px 13px 20px;
	border-radius: 10px;
	background: #fff;
	background: -moz-linear-gradient(#fff, #999);
	background: -webkit-linear-gradient(#fff, #999);
	background: -o-linear-gradient(#fff, #999);
}

.close {
	background: #606061;
	color: #FFFFFF;
	line-height: 25px;
	position: absolute;
	right: -12px;
	text-align: center;
	top: -10px;
	width: 24px;
	text-decoration: none;
	font-weight: bold;
	-webkit-border-radius: 12px;
	-moz-border-radius: 12px;
	border-radius: 12px;
	-moz-box-shadow: 1px 1px 3px #000;
	-webkit-box-shadow: 1px 1px 3px #000;
	box-shadow: 1px 1px 3px #000;
}

.close:hover { background: #00d9ff; }
</style>';
					$html = preg_replace("/<\/head>/", $right_click . $style."\n</head>", $html);
					$html = preg_replace("/<\/body>/", $popup . "\n</body>", $html);
					break;
				case 2:
					$html = preg_replace('/<img /', '<img oncontextmenu="return false" ', $html);
					break;
			} 

			// Disable Select and Copy
			$disable_copy = $this->params->get('disable_copy');
			if($disable_copy != '0') {
				// Disable text selection
				if($disable_copy == '2'){
					$disable_copy = 'true';
				}else{
					$disable_copy = 'false';
				}
				$select = "
<script type=\"text/javascript\">
	function disableSelection(target){
	if (typeof target.onselectstart!=\"undefined\") // IE
		target.onselectstart=function(){return false}
	else if (typeof target.style.MozUserSelect!=\"undefined\") // Firefox
		target.style.MozUserSelect=\"none\"
	else // Opera etc
		target.onmousedown=function(){return ".$disable_copy."}
	target.style.cursor = \"default\"
	}
</script>";
				$html = preg_replace("/<\/head>/", $select . "\n</head>", $html);
				$select = "
<script type=\"text/javascript\">
	disableSelection(document.body)
</script>";
				$html = preg_replace("/<\/body>/", $select . "\n</body>", $html);

				$html = preg_replace('/<img /', '<img ondragstart="return false;" ', $html);
				$html = preg_replace('/<a /', '<a ondragstart="return false;" ', $html);

				$copy = "
<script type=\"text/javascript\">
		window.addEvent('domready', function() {
			document.body.oncopy = function() {
				return false;
			}
		});
</script>";
				$html = preg_replace("/<\/head>/", $copy . "\n</head>", $html);
				$html = preg_replace('/<\/head>/', '<meta http-equiv="imagetoolbar" content="no">'."\n</head>", $html);

			} // Disable Select and Copy

		} // Set Permission


		// Response
		JResponse::setBody($html);
		return true;

	} // onAfterRender

} // class

?>
