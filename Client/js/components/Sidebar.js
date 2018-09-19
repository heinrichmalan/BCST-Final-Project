import React from "react";
import { Link } from "react-router-dom";

//NOTES//
//Implement className="navbar nav_title" style="border: 0;"
//Links

class Sidebar extends React.Component {
    componentDidMount() {

      (function($,sr){
        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function (func, threshold, execAsap) {
          var timeout;
    
            return function debounced () {
                var obj = this, args = arguments;
                function delayed () {
                    if (!execAsap)
                        func.apply(obj, args);
                    timeout = null;
                }
    
                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);
    
                timeout = setTimeout(delayed, threshold || 100);
            };
        };
    
        // smartresize
        jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
    
    })(jQuery,'smartresize');


      var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
          $BODY = $('body'),
          $MENU_TOGGLE = $('#menu_toggle'),
          $SIDEBAR_MENU = $('#sidebar-menu'),
          $SIDEBAR_FOOTER = $('.sidebar-footer'),
          $LEFT_COL = $('.left_col'),
          $RIGHT_COL = $('.right_col'),
          $NAV_MENU = $('.nav_menu'),
          $FOOTER = $('footer');

    // Sidebar
  // TODO: This is some kind of easy fix, maybe we can improve this
  var setContentHeight = function () {
    // reset height
    $RIGHT_COL.css('min-height', $(window).height());
  
    var bodyHeight = $BODY.outerHeight(),
      footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
      leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
      contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;
  
    // normalize content
    contentHeight -= $NAV_MENU.height() + footerHeight;
  
    $RIGHT_COL.css('min-height', contentHeight);
  };
  
    $SIDEBAR_MENU.find('a').on('click', function(ev) {
      console.log('clicked - sidebar_menu');
          var $li = $(this).parent();
  
          if ($li.is('.active')) {
              $li.removeClass('active active-sm');
              $('ul:first', $li).slideUp(function() {
                  setContentHeight();
              });
          } else {
              // prevent closing menu if we are on child menu
              if (!$li.parent().is('.child_menu')) {
                  $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                  $SIDEBAR_MENU.find('li ul').slideUp();
              }else
              {
          if ( $BODY.is( ".nav-sm" ) )
          {
            $li.parent().find( "li" ).removeClass( "active active-sm" );
            $li.parent().find( "li ul" ).slideUp();
          }
        }
              $li.addClass('active');
  
              $('ul:first', $li).slideDown(function() {
                  setContentHeight();
              });
          }
      });
  
  // toggle small or large menu
  /*
  $MENU_TOGGLE.on('click', function() {
      console.log('clicked - menu toggle');
  
      if ($BODY.hasClass('nav-md')) {
        $SIDEBAR_MENU.find('li.active ul').hide();
        $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
      } else {
        $SIDEBAR_MENU.find('li.active-sm ul').show();
        $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
      }
  
    $BODY.toggleClass('nav-md nav-sm');
  
    setContentHeight();
  
    $('.dataTable').each ( function () { $(this).dataTable().fnDraw(); });
  });*/
  
    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');
  
    $SIDEBAR_MENU.find('a').filter(function () {
      return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
      setContentHeight();
    }).parent().addClass('active');
  
    // recompute content when resizing
    $(window).smartresize(function(){
      setContentHeight();
    });
  
    setContentHeight();
  
    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
      $('.menu_fixed').mCustomScrollbar({
        autoHideScrollbar: true,
        theme: 'minimal',
        mouseWheel:{ preventDefault: true }
      });
  };
  // /Sidebar
}

    render() {
        return (
            <div className="col-md-3 left_col">
              <div className="left_col scroll-view">

                {/* Sidebar title */}
                <div className="navbar nav_title">
                  <a href="#home" className="site_title"><i className="fa fa-paw"></i> <span>Dashboard</span></a>
                </div>
                {/* /Sidebar title */}

                <div class="clearfix"></div>

                {/* Sidebar profile quick info */}
                <div className="profile clearfix">
                  <div className="profile_pic">
                    <img src="../img/leanne_icon.jpg" alt="..." className="img-circle profile_img"/>
                  </div>
                  <div className="profile_info">
                    <span>Welcome,</span>
                    <h2>Leanne Hassett</h2>
                  </div>
                </div>
                {/* /Sidebar profile quick info */}

                <br/>

                {/* Sidebar menu */}
                <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                  <div className="menu_section">
                    <h3>General</h3>
                    <ul className="nav side-menu">
                      <li><a href="home.html"><em className="fa fa-home"></em> Home <span  className="label label-success pull-right"></span></a></li>
                      <li><a><i className="fa fa-edit"></i> Patients <span className="fa fa-chevron-down"></span></a>
                        <ul className="nav child_menu">
                          <li><a href="contacts.html">Current Patient</a></li>
                          <li><a href="out.html">Archived Patient</a></li>
                        </ul>
                      </li>
                      <li><a href="calendar.html"><i className="fa fa-desktop"></i> Calendar <span className="label label-success pull-right"></span></a></li>
                    </ul>
                  </div>
                </div>
                {/* /Sidebar menu */}
     
              </div>
            </div>
        )
    }
}

export default Sidebar;