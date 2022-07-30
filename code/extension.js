
const vscode = require('vscode');
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://gerrydeemo:Gerald2482@cluster0.4oxpb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";





/**
 * @param {vscode.ExtensionContext} context
 */

// every time a user saves their code upload data to mongodb database



function activate(context) {
	let discontent = vscode.commands.registerCommand('code.CodeResumeRegister', () => {
		let lastTagged = context.globalState.get('username.code', '');
		if (lastTagged === "") {
			vscode.window.showInputBox({
				placeHolder: "Please enter a your username",
			}).then(value => {
				var uname = value
				context.globalState.update('username.code', uname);
			})
		} else {
			vscode.window.showInformationMessage("You account is already connected");
		}
	});

	let disposable = vscode.commands.registerCommand('code.CodeResume', function () {
		let gotUser = context.globalState.get('username.code', '');
		console.log(gotUser)
		var uname = gotUser;
		let clientseconds = 0;
		let clientminutes = 0;
		let clienthours = 0;



		let interval = setInterval(function () {
			clientseconds++;

			if (clientseconds > 59) {
				clientminutes++;
				clientseconds = 0;
			}

			if (clientminutes > 60) {
				clienthours++;
				clientminutes = 0;
			}

			vscode.window.setStatusBarMessage(`${uname}: ${clienthours}h ${clientminutes}m ${clientseconds}s`);
			vscode.workspace.onDidSaveTextDocument(function () {
				MongoClient.connect(url, function (err, client) {
					if (err) throw err;
					const db = client.db("account-app");
					const users = db.collection("users");
					users.find({ username: uname }).toArray(function (err, result) {
						if (err) throw err;
						console.log(result);
						var dbhours = result[0].hours;
						var dbminutes = result[0].minutes;
						if (dbhours === undefined) dbhours = 0;
						if (dbminutes === undefined) dbminutes = 0;
						var dbminutess = parseInt(dbminutes, 10);
						var dbhourss = parseInt(dbhours, 10);
						var thours = clienthours + dbhourss;
						var tmins = clientminutes + dbminutess;

						console.log(thours, tmins);
						var myobj = { $set: { minutes: tmins, hours: thours } };
						MongoClient.connect(url, function (err, client) {
							if (err) throw err;
							const db = client.db("account-app");
							const users = db.collection("users");
							users.updateOne(
								{ username: uname },
								myobj,
								function (err, res) {
									if (err) throw err;
									console.log("1 document inserted");
									db.close();
								}
							);
						});
						client.close();
					});
				});
			});



		}, 1000);
	});

	context.subscriptions.push(disposable, discontent);

};




function deactivate() { }

module.exports = {
	activate,
	deactivate
}
