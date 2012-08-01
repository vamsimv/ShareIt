function oldBrowser()
{
	$('#clicky').html('Your browser is not modern enough to serve as a host. :(<br /><br />(Try Chrome or Firefox!)');
}

function onopen()
{
	$('#clicky').html("<br /><br /><br /><br />Click here to choose files");
	$('#fileslist').html('Awaiting file list..');
}

function log(level, msg)
{
	switch(level)
	{
		case 'warning':
			msg = '<span style="color: red;">' + msg + '</span>'
			break
	}

	msg += '<br/>'

	$('#log').append(msg);
}

function info(msg)
{
	log('info', msg);
}

function warning(msg)
{
	log('warning', msg);
}

$(document).ready(function()
{
	document.getElementById('files').addEventListener('change', function(event)
	{
		files_change(event.target.files); // FileList object
    }, false);
})

function _button_host()
{
	var bold = document.createElement("B");
		bold.appendChild(document.createTextNode("Sharing!"));

	return bold
}

function _button_peer(file)
{
    var div = document.createElement("DIV");
    	div.id = file.name

	div.transfer = function()
	{
	    var transfer = document.createElement("A");
	    	transfer.href = ""
	    	transfer.onclick = function()
	    	{
		    	transfer_begin(file);
		    	return false;
	    	}
			transfer.appendChild(document.createTextNode("Transfer"));

		while(div.firstChild)
			div.removeChild(div.firstChild);
		div.appendChild(transfer);
	}
	
	div.progressbar = function()
	{
		var progress = document.createTextNode("0%")

		while(div.firstChild)
			div.removeChild(div.firstChild);
		div.appendChild(progress);
	}
	
	div.savetodisk = function(data)
	{
	    var save = document.createElement("A");
	    	save.href = "data:" + file.type + ";base64," + encode64(data)
	    	save.target = "_blank"
			save.appendChild(document.createTextNode("Save to disk!"));

		while(div.firstChild)
			div.removeChild(div.firstChild);
		div.appendChild(save);
	}

	div.transfer()

    return div
}

function _ui_updatefiles(area, button, files)
{
	var filestable = document.createElement('TABLE');
		filestable.id = "filestable"
		filestable.cellspacing = 0
		filestable.summary = ""

	var tr = document.createElement('TR');
	filestable.appendChild(tr);

	var th = document.createElement('TH');
		th.scope = "col"
		th.abbr = "Filename"
		th.class = "nobg"
		th.width = "60%"
		th.appendChild(document.createTextNode("Filename"));
	tr.appendChild(th);

	var th = document.createElement('TH');
		th.scope = "col"
		th.abbr = "Size"
		th.class = "nobg"
		th.width = "20%"
		th.appendChild(document.createTextNode("Size"));
	tr.appendChild(th);

	var th = document.createElement('TH');
		th.scope = "col"
		th.abbr = "Status"
		th.class = "nobg"
		th.width = "20%"
		th.appendChild(document.createTextNode("Action"));
	tr.appendChild(th);

	// Remove old table and add new empty one
	while(area.firstChild)
		area.removeChild(area.firstChild);
  	area.appendChild(filestable)

	for(var filename in files)
		if(files.hasOwnProperty(filename))
		{
            var file = files[filename]

			var tr = document.createElement('TR');
			filestable.appendChild(tr)

			var th = document.createElement('TH');
				th.scope = "row"
				th.class = "spec"
				th.appendChild(document.createTextNode(file.name));
			tr.appendChild(th)

			var td = document.createElement('TD');
				td.appendChild(document.createTextNode(file.size));
			tr.appendChild(td)

			var td = document.createElement('TD');
				td.class = "end"
				td.appendChild(button(file));
			tr.appendChild(td)
		}
}

function ui_updatefiles_host(files)
{
    _ui_updatefiles(document.getElementById('clicky'), _button_host, files)
}

function ui_updatefiles_peer(files)
{
    _ui_updatefiles(document.getElementById('fileslist'), _button_peer, files)
}

function ui_filedownloading(filename, percent)
{
	$("#" + filename).html(percent + '%');
}

function ui_filedownloaded(filename, data)
{
	document.getElementById(filename).savetodisk(data);

	info("Transfer finished!");
}

function ui_peerstate(msg)
{
	$('#peer').html(msg);
}