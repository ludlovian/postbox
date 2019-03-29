# postbox
async post &amp; retrieval

## Purpose

A postbox is like a Python `queue` or a pipe. Items can be added and are processed one-at-a-time in FIFO order.

## API

### postbox
```
import Postbox from 'postbox'
const pb = new Postbox(width = 1)
```

Creates an empty postbox. The `width` is the concurrency - how many readers can
read at a time.

### post
`pb.post(item)`

Posts an item into the postbox

### get
`item = await pb.get(options)`

Options:
- wait - if true, the postbox will remain locked until `release` is called (default false)

Waits for and retrieves an item from the postbox.

### release
`pb.release()`
Releases the postbox to process the next item, if `get` was called with `{ wait: true }`


### getAll
`for await (item of pb.getAll()) { ... }`

Creates an async iterable for each item as it arrives

### idle
A promise that resolves when the queue is idle

### busy
A promise that resolves when the queue is busy

### size
The current size of undelivered items in the postbox

### active
The number of locked items currently being processed.
