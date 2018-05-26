$(document).ready(function(){
  $('#contactForm').submit(function(event){
  	event.preventDefault()
    console.log('User is submitting the form')
     $.post("/contact", $("#contactForm").serialize(), function () {
      $('#success').html("<div class='alert alert-success'><strong>Your message has been sent.</strong></div>")
	  $('#contactForm').trigger('reset')
    })
    .fail(function (error) {
      $('#success').html("<div class='alert alert-danger'><strong>Something went wrong! " + error.responseText +"</strong></div>")
    })
  })
})