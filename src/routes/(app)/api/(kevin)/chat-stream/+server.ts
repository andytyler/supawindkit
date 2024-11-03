import { chatStore } from "$lib/stores/chatStore";

export function GET() {
	let controller: ReadableStreamDefaultController;
	let closed = false;
	let previousState: { [run_id: string]: number } = {};

	const stream = new ReadableStream({
		start(c) {
			controller = c;

			const unsubscribe = chatStore.subscribe((allChats) => {
				if (closed) return;

				// For each run_id, check if there are new chats
				for (const run_id in allChats) {
					const chats = allChats[run_id];
					const previousLength = previousState[run_id] || 0;

					if (chats.length > previousLength) {
						const newChats = chats.slice(previousLength);
						newChats.forEach((chat) => {
							try {
								controller.enqueue(`data: ${JSON.stringify(chat)}\n\n`);
							} catch (error) {
								console.error("Error enqueueing data:", error);
							}
						});
						previousState[run_id] = chats.length;
					}
				}
			});

			return () => {
				closed = true;
				unsubscribe();
			};
		},
		cancel() {
			closed = true;
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
