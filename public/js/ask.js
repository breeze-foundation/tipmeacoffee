$('.ask_me').click(function() {
    let input_ask = $("#ask_field").val(); 
    if (!input_ask){ $("#ask_field").css("border-color", "RED");toastr.error('phew... You forgot to ask question');$('#ask_plus').html('Ask');$(".ask_me").attr("disabled", false);return false;}
    $('#ask_plus').html('Preparing answer...');$(".ask_me").prop("disabled", true).css("cursor", "not-allowed");
    $('.share_link').hide();
    $('.shrim-title').html(input_ask);
    $('.shrim-wrap').show();
  
    $.ajax({url: '/askengine',type: 'POST',data: JSON.stringify({ title: input_ask }),contentType: 'application/json',
      success: function(data, textStatus, jqXHR) {
        if (jqXHR.status === 404) { 
          toastr.error('Unable to process request, please ask support team');
        } else if (data.error === true) {
          toastr.error(data.message);
          $('.shrim-title').html();
          $('.shrim-wrap').hide();
          $('.share_link').show();
          $('#ask_plus').html('Ask');$(".ask_me").attr("disabled", false).css("cursor", "pointer");return false; 
        } else {
          //console.log(data.output);
          //$('#output').html(data.output);
          setTimeout(function(){window.location.href = '/search/'+data.author+'/'+data.link;}, 200); 
        }
      }, 
      error: function(jqXHR, textStatus, errorThrown) {
        //console.error('AJAX Error:', textStatus, errorThrown);
        toastr.error('An error occurred, please ask support team.');
        $('.shrim-title').html();
        $('.shrim-wrap').hide();
        $('.share_link').show();
        $('#ask_plus').html('Ask');$(".ask_me").attr("disabled", false).css("cursor", "pointer");return false;
      },
    //   complete: function() {
    //     // Always re-enable the button and reset its state
    //     $('.shrim-title').html();
    //     $('.shrim-wrap').hide();
    //     $('.share_link').show();
    //     $('#ask_plus').html('Ask');
    //     $(".ask_me").attr("disabled", false).css("cursor", "pointer");
    //   } 
    });
  });