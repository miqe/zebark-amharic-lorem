import * as vscode from "vscode";

const command = 'zebark';
const regexp = new RegExp(`(${command}([^\sa-zA-Z]*))`, 'gis');
const text = "እንጂ ብጠይቅ እሱ እሷ ወጣቶቹ ምድር ኢትዮጵያ ሌላውን ለሱሪ እና ወይም ቀይሮ መጠቀም መብላት ይቻላል ቃላቶች በዘፈቀደ ውድ ጎበዝ ገሰገሰ የጋሪው ዕቅድ ግጥም በጊዜ የኩሬውን በምስራቅ አጠናቀቁ አጠናቀቁ በጠዋቱ የተሳካለት መተግበሪያ እንደ እኔ ታታሪ ለገላገሉት ሲሻገር መመልከት ተረት ለሚገኙ ከእትዬ የፈጠራን እየቀደመን ችሎታ መጸሐፍ መቋረጥ ምስጥርን ትክክል ጎሮምሳ እንደኛው ቅኔዎቹ በመስኮት ነጥቡ በረረ";
const inital = "ዘባርቅ";
const endSymbols = "።!?";

export function activate(context: vscode.ExtensionContext) {

	const insertText = (length: any) => {
		let editor: any = vscode.window.activeTextEditor;
		editor.edit((edit: any) =>
			editor.selections.forEach((selection: any) => {
				edit.delete(selection);
				edit.insert(selection.start, zebark(length));
			})
		);
	};

	const zebark = (length: any) => {
		let result: string = "";
		if (!length) {
			length = 200;
		}
		let words = text.split(" ");

		result += inital + " ";

		let end = " ";
		for (let i = 0; i < length - 1; i++) {
			if (i === length - 2) {
				end = endSymbols.split("")[Math.floor(Math.random() * endSymbols.length)];
			}
			result += words[Math.floor(Math.random() * (words.length - 1))] + end;

		}
		return result;
	};


	const extractNumber = (
		document: vscode.TextDocument,
		position: vscode.Position,
	): number => {
		const replaceCommandFromLastGroup = (
			matchGroup: RegExpMatchArray,
		): number => {
			const lastGroup = matchGroup[matchGroup.length - 1];

			if (lastGroup === command) {
				return 0;
			}
			return parseInt(lastGroup.replace(command, ""));
		};

		const line: string = document.lineAt(position).text;
		const matchGroup: RegExpMatchArray | null = line.match(regexp);

		return matchGroup !== null ? replaceCommandFromLastGroup(matchGroup) : 0;
	};

	// trigger zebark through autocomplete
	const autoComplete = vscode.languages.registerCompletionItemProvider("*", {
		provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position
		) {
			const wordCount = extractNumber(document, position);

			const cmd = new vscode.CompletionItem(command);

			cmd.insertText = new vscode.SnippetString(
				zebark(wordCount)
			);

			cmd.label = `${command}${wordCount || ''}`;

			cmd.documentation = new vscode.MarkdownString("መዘባረቅ generate random amharic words.");

			return [cmd];
		}
	},
		"1", "2", "3", "4", "5", "6", "7", "8", "9", "0");

	// trigger zebark through command palette
	let disposable = vscode.commands.registerCommand(
		"zebark.jemir",
		() => {
			insertText(0);
		}
	);

	context.subscriptions.push(autoComplete, disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
