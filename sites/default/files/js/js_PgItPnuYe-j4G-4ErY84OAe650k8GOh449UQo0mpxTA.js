(function($){

  //variable for storing the menu count when no ID is present
  var menuCount = 0;
  
  //plugin code
  $.fn.mobileMenu = function(options){
    
    //plugin's default options
    var settings = {
      switchWidth: 750,
      topOptionText: 'Select menu item',
      indentString: '&nbsp;&nbsp;&nbsp;'
    };
    
    
    //function to check if selector matches a list
    function isList($this){
      return $this.is('ul, ol');
    }
  
  
    //function to decide if mobile or not
    function isMobile(){
      return ($(window).width() < settings.switchWidth);
    }
    
    
    //check if dropdown exists for the current element
    function menuExists($this){
      
      //if the list has an ID, use it to give the menu an ID
      if($this.attr('id')){
        return ($('#mobileMenu_'+$this.attr('id')).length > 0);
      } 
      
      //otherwise, give the list and select elements a generated ID
      else {
        menuCount++;
        $this.attr('id', 'mm'+menuCount);
        return ($('#mobileMenu_mm'+menuCount).length > 0);
      }
    }
    
    
    //change page on mobile menu selection
    function goToPage($this){
      if($this.val() !== null){document.location.href = $this.val()}
    }
    
    
    //show the mobile menu
    function showMenu($this){
      $this.css('display', 'none');
      $('#mobileMenu_'+$this.attr('id')).show();
    }
    
    
    //hide the mobile menu
    function hideMenu($this){
      $this.css('display', '');
      $('#mobileMenu_'+$this.attr('id')).hide();
    }
    
    
    //create the mobile menu
    function createMenu($this){
      if(isList($this)){
                
        //generate select element as a string to append via jQuery
        var selectString = '<select id="mobileMenu_'+$this.attr('id')+'" class="mobileMenu">';
        
        //create first option (no value)
        selectString += '<option value="">'+settings.topOptionText+'</option>';
        
        //loop through list items
        $this.find('li').each(function(){
          
          //when sub-item, indent
          var levelStr = '';
          var len = $(this).parents('ul, ol').length;
          for(i=1;i<len;i++){levelStr += settings.indentString;}
          
          //get url and text for option
          var link = $(this).find('a:first-child').attr('href');
          var text = levelStr + $(this).clone().children('ul, ol').remove().end().text();
          
          //add option
          selectString += '<option value="'+link+'">'+text+'</option>';
        });
        
        selectString += '</select>';
        
        //append select element to ul/ol's container
        $this.parent().append(selectString);
        
        //add change event handler for mobile menu
        $('#mobileMenu_'+$this.attr('id')).change(function(){
          goToPage($(this));
        });
        
        //hide current menu, show mobile menu
        showMenu($this);
      } else {
        alert('mobileMenu will only work with UL or OL elements!');
      }
    }
    
    
    //plugin functionality
    function run($this){
      
      //menu doesn't exist
      if(isMobile() && !menuExists($this)){
        createMenu($this);
      }
      
      //menu already exists
      else if(isMobile() && menuExists($this)){
        showMenu($this);
      }
      
      //not mobile browser
      else if(!isMobile() && menuExists($this)){
        hideMenu($this);
      }

    }
    
    //run plugin on each matched ul/ol
    //maintain chainability by returning "this"
    return this.each(function() {
      
      //override the default settings if user provides some
      if(options){$.extend(settings, options);}
      
      //cache "this"
      var $this = $(this);
    
      //bind event to browser resize
      $(window).resize(function(){run($this);});

      //run plugin
      run($this);

    });
    
  };
  
})(jQuery);;
/*
 * Superfish v1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */
(function($){$.fn.superfish=function(op){var sf=$.fn.superfish,c=sf.c,$arrow=$(['<span class="',c.arrowClass,'"> &#xbb;</span>'].join("")),over=function(){var $$=$(this),menu=getMenu($$);clearTimeout(menu.sfTimer);$$.showSuperfishUl().siblings().hideSuperfishUl();},out=function(){var $$=$(this),menu=getMenu($$),o=sf.op;clearTimeout(menu.sfTimer);menu.sfTimer=setTimeout(function(){o.retainPath=($.inArray($$[0],o.$path)>-1);$$.hideSuperfishUl();if(o.$path.length&&$$.parents(["li.",o.hoverClass].join("")).length<1){over.call(o.$path);}},o.delay);},getMenu=function($menu){var menu=$menu.parents(["ul.",c.menuClass,":first"].join(""))[0];sf.op=sf.o[menu.serial];return menu;},addArrow=function($a){$a.addClass(c.anchorClass).append($arrow.clone());};return this.each(function(){var s=this.serial=sf.o.length;var o=$.extend({},sf.defaults,op);o.$path=$("li."+o.pathClass,this).slice(0,o.pathLevels).each(function(){$(this).addClass([o.hoverClass,c.bcClass].join(" ")).filter("li:has(ul)").removeClass(o.pathClass);});sf.o[s]=sf.op=o;$("li:has(ul)",this)[($.fn.hoverIntent&&!o.disableHI)?"hoverIntent":"hover"](over,out).each(function(){if(o.autoArrows){addArrow($(">a:first-child",this));}}).not("."+c.bcClass).hideSuperfishUl();var $a=$("a",this);$a.each(function(i){var $li=$a.eq(i).parents("li");$a.eq(i).focus(function(){over.call($li);}).blur(function(){out.call($li);});});o.onInit.call(this);}).each(function(){var menuClasses=[c.menuClass];if(sf.op.dropShadows&&!($.browser.msie&&$.browser.version<7)){menuClasses.push(c.shadowClass);}$(this).addClass(menuClasses.join(" "));});};var sf=$.fn.superfish;sf.o=[];sf.op={};sf.IE7fix=function(){var o=sf.op;if($.browser.msie&&$.browser.version>6&&o.dropShadows&&o.animation.opacity!=undefined){this.toggleClass(sf.c.shadowClass+"-off");}};sf.c={bcClass:"sf-breadcrumb",menuClass:"sf-js-enabled",anchorClass:"sf-with-ul",arrowClass:"sf-sub-indicator",shadowClass:"sf-shadow"};sf.defaults={hoverClass:"sfHover",pathClass:"overideThisToUse",pathLevels:1,delay:800,animation:{opacity:"show"},speed:"normal",autoArrows:true,dropShadows:true,disableHI:false,onInit:function(){},onBeforeShow:function(){},onShow:function(){},onHide:function(){}};$.fn.extend({hideSuperfishUl:function(){var o=sf.op,not=(o.retainPath===true)?o.$path:"";o.retainPath=false;var $ul=$(["li.",o.hoverClass].join(""),this).add(this).not(not).removeClass(o.hoverClass).find(">ul").hide().css("visibility","hidden");o.onHide.call($ul);return this;},showSuperfishUl:function(){var o=sf.op,sh=sf.c.shadowClass+"-off",$ul=this.addClass(o.hoverClass).find(">ul:hidden").css("visibility","visible");sf.IE7fix.call($ul);o.onBeforeShow.call($ul);$ul.animate(o.animation,o.speed,function(){sf.IE7fix.call($ul);o.onShow.call($ul);});return this;}});})(jQuery);;
jQuery(document).ready(function() {

	jQuery('#main-menu ul.menu').mobileMenu();
	

/* Navigation */
	jQuery('#main-menu ul.menu').superfish({ 
		delay:       500,								// 0.1 second delay on mouseout 
		animation:   {opacity:'show',height:'show'},	// fade-in and slide-down animation 
		dropShadows: true								// disable drop shadows 
	});	

});;
