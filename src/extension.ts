import * as vscode from "vscode";

const command = 'zebark';
const command2 = 'zebarkpara';
const regexp = new RegExp(`(${command}([^\sa-zA-Z]*))`, 'gis');
const text = "እንጂ ብጠይቅ እሱ እሷ ወጣቶቹ ምድር ኢትዮጵያ ሌላውን ለሱሪ እና ወይም ቀይሮ መጠቀም መብላት ይቻላል ቃላቶች በዘፈቀደ ውድ ጎበዝ ገሰገሰ የጋሪው ዕቅድ ግጥም በጊዜ የኩሬውን በምስራቅ አጠናቀቁ አጠናቀቁ በጠዋቱ የተሳካለት መተግበሪያ እንደ እኔ ታታሪ ለገላገሉት ሲሻገር መመልከት ተረት ለሚገኙ ከእትዬ የፈጠራን እየቀደመን ችሎታ መጸሐፍ መቋረጥ ምስጥርን ትክክል ጎሮምሳ እንደኛው ቅኔዎቹ በመስኮት ነጥቡ በረረ";
const inital = "ዘባርቅ";
const endSymbols = "።!?";

export function activate(context: vscode.ExtensionContext) {

	const insertText = (length: any, type: string) => {
		let editor: any = vscode.window.activeTextEditor;
		editor.edit((edit: any) =>
			editor.selections.forEach((selection: any) => {
				edit.delete(selection);
				edit.insert(selection.start, zebark(length, type));
			})
		);
	};

	const zebark = (length: any, type: string) => {
		let result: string = "";
		if (!length) {
			length = Math.floor(Math.random() * (15 - 5) + 5);
		}

		if (type === 'para') {
			result += inital + buildParagraph(length);
		} else {
			result += inital + buildSentence(length);
		}

		return result;
	};

	const buildParagraph = (length: any) => {
		let paragraph: string = "";

		for (let i = 0; i < length; i++) {
			paragraph += buildSentence(Math.floor(Math.random() * (15 - 5) + 5));
		}

		return paragraph;
	};

	const buildSentence = (length: any) => {
		let sentence: string = " ";

		let words = text.split(" ");

		let end = " ";
		for (let i = 0; i < length - 1; i++) {
			if (i === length - 2) {
				end = endSymbols.split("")[Math.floor(Math.random() * endSymbols.length)];
			}
			sentence += words[Math.floor(Math.random() * (words.length - 1))] + end;
		}
		return sentence;
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
				zebark(wordCount, '')
			);

			cmd.label = `${command}${wordCount || ''}`;

			cmd.documentation = new vscode.MarkdownString("መዘባረቅ generate random amharic sentence.");

			return [cmd];
		}
	},
		"1", "2", "3", "4", "5", "6", "7", "8", "9", "0");

	// trigger zebark through autocomplete
	const autoCompletePara = vscode.languages.registerCompletionItemProvider("*", {
		provideCompletionItems(
		) {
			const cmd = new vscode.CompletionItem(command2);

			cmd.insertText = new vscode.SnippetString(
				zebark(0, 'para')
			);

			cmd.label = `${command2}`;

			cmd.documentation = new vscode.MarkdownString("መዘባረቅ generate random amharic paragraph.");

			return [cmd];
		}
	},
		"1", "2", "3", "4", "5", "6", "7", "8", "9", "0");

	// trigger zebark through command palette
	let disposable = vscode.commands.registerCommand(
		"zebark.zebark",
		() => {
			insertText(0, '');
		}
	);
	
	// trigger zebark through command palette
	let disposablePara = vscode.commands.registerCommand(
		"zebarkpara.zebark",
		() => {
			insertText(0, 'para');
		}
	);

	context.subscriptions.push(autoComplete, autoCompletePara, disposable, disposablePara);
}

// this method is called when your extension is deactivated
export function deactivate() { }