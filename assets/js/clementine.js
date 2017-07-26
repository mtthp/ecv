var timeout_handlers = [] // store timeout handlers

/**
 * Add a new row
 */
function addRow() {
  var tr_element = document.createElement("tr")
  for (var i = 0; i < $('table th').length - 1; i++) {
    var td_element = document.createElement("td")
    if (i == 0) {
      $(td_element).text(parseInt($('table tbody tr:not(:last-of-type)').last().find('td:first-child').text()) + 1)
    } else {
      $(td_element).on('click', onCellClick)
      $(td_element).on('mouseover', onCellHover)
      $(td_element).on('mouseout', onCellOut)
    }
    
    $(tr_element).append(td_element)
  }
  $('table tbody tr:not(:last-of-type)').last().after(tr_element)
}

/**
 * Add a new column
 */
function addColumn() {
  var th_element = document.createElement("th")
  $(th_element).text(parseInt($('table thead th:not(:last-of-type)').last().text()) + 1)
  $('table thead th:not(:last-of-type)').last().after(th_element)
  $('table tbody tr:not(:last-of-type)').each(function(tr_element){
    var td_element = document.createElement("td")
    $(td_element).on('click', onCellClick)
    $(td_element).on('mouseover', onCellHover)
    $(td_element).on('mouseout', onCellOut)
    $(this).append(td_element)
  })
  $('table tfoot tr td').attr('colspan', $('table thead th').length)
}

/**
 * Empty the table
 */
function restart() {
  showSnackbar("Here we go again")
  timeout_handlers.forEach(function(value){
    clearTimeout(value)
  })
  timeout_handlers = []
  $('table tbody tr td:not(:first-child)').removeClass('processed').text("")
}

/**
 * Click on all the cells
 */
function clickAll() {
  showSnackbar("Clicking on all the cells...")
  timeout_handlers.forEach(function(value){
    clearTimeout(value)
  })
  timeout_handlers = []
  $('table tbody tr td:not(:first-child)').each(function(index){
    if (!$(this).hasClass("processed")) {
      var element = this
      var handler = setTimeout(function(){
        $(element).click()
      }, timeout_handlers.length * 100)
      timeout_handlers.push(handler)
    }
  })
}

/**
 * Show the snackbar with a message and an action
 */
function showSnackbar(title, timeout, actionText, actionHandler) {
  var data = {
    message: title,
    timeout: typeof timeout !== "undefined" ? timeout : 1000,
  };

  if (typeof actionText !== "undefined") {
    data.actionText = actionText;
  }

  if (typeof actionHandler !== "undefined") {
    data.actionHandler = actionHandler;
  }

  if (typeof $('.mdl-snackbar').get(0).MaterialSnackbar !== "undefined") {
        $('.mdl-snackbar').get(0).MaterialSnackbar.queuedNotifications_ = []; // pour reset la queue
        $('.mdl-snackbar').get(0).MaterialSnackbar.showSnackbar(data);
      }
    }

/**
 * Show a random cool message
 */
function showCoolMessage(){
  var cool_messages = ["Nice !", "Congrats !", "Keep on going", "You can do better than that", "You're the best !", "So much fun", "#swag"]
  var cool_message = cool_messages[Math.floor(Math.random()*cool_messages.length)]
  showSnackbar(cool_message)
}

/**
 * Cell click handler
 */
function onCellClick(){
  if (!$(this).hasClass('processed')) {
    var row_index = $(this).closest('tr').index()
    var column_index = $(this).index() - 1
    $(this).text(row_index * column_index).addClass('processed')
    showCoolMessage()
  }
}

/**
 * Cell mousein handler
 */
function onCellHover(){
  var row_index = $(this).closest('tr').index()
  var column_index = $(this).index() - 1

  if (!$(this).hasClass('processed')) {
    $(this).text(row_index + "*" + column_index)
  }

  $('table thead th:nth-child(' + parseInt(column_index + 2) + ')').addClass('hovered');
  $('table tbody tr:nth-child(' + parseInt(row_index + 1) + ') td:first-child').addClass('hovered');
  $('table tbody tr:nth-child(' + parseInt(row_index + 1) + ') td:nth-child(-n+' + parseInt(column_index + 2) + ')').addClass('linked')
  $('table tbody tr:nth-child(-n+' + parseInt(row_index + 1) + ') td:nth-child(' + parseInt(column_index + 2) + ')').addClass('linked')
}

/**
 * Cell mouseout handler
 */
function onCellOut(){
  if (!$(this).hasClass('processed')) {
    $(this).text("")
  }
  var row_index = $(this).closest('tr').index()
  var column_index = $(this).index() 
  $('table thead th:nth-child(' + parseInt(column_index + 1) + ')').removeClass('hovered');
  $('table tbody tr:nth-child(' + parseInt(row_index + 1) + ') td:first-child').removeClass('hovered');
  $('table tbody tr:nth-child(' + parseInt(row_index + 1) + ') td:nth-child(-n+' + parseInt(column_index + 1) + ')').removeClass('linked')
  $('table tbody tr:nth-child(-n+' + parseInt(row_index + 1) + ') td:nth-child(' + parseInt(column_index + 1) + ')').removeClass('linked')
}

// initialisation
$('table tbody td:not(:first-child)').on('click', onCellClick)
$('table tbody td:not(:first-child)').on('mouseover', onCellHover)
$('table tbody td:not(:first-child)').on('mouseout', onCellOut)
