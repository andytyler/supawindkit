import { chatStore } from "$lib/stores/chatStore";

export function GET() {
	let controller: ReadableStreamDefaultController;
	let closed = false;

	const stream = new ReadableStream({
		start(c) {
			controller = c;
			let previousLength = 0;

			const unsubscribe = chatStore.subscribe((chats) => {
				if (closed) return;
				if (chats.length > previousLength) {
					const newChats = chats.slice(previousLength);
					newChats.forEach((chat) => {
						try {
							controller.enqueue(`data: ${JSON.stringify(chat)}\n\n`);
						} catch (error) {
							console.error("Error enqueueing data:", error);
						}
					});
					previousLength = chats.length;
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
