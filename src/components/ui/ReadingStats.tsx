import { type Book } from "@/db/schema";

export function ReadingStats({allBooks} : {allBooks : Book[]}) {
    const paragraphStyle: string = "text-md text-ink-muted";
    const spanStyle = "text-md text-ink font-bold";
    const divStyle: string = "rounded-xl border border-border bg-surface p-4 shadow-warm";
    const millisecondsInADay: number = 86_400_000;

    const finishedBooks = allBooks.filter((book) => {
        return book.status === "finished";
    });
    /*
    fields:
    Total books read in the time period (For now, a year)
    Average time it takes to finish a book (measured in hours or days, whichever is smaller)
    Fastest read (measured in hours or days, whichever is smaller)
    */
   
    const totalBooksRead = finishedBooks.length;

    // format may have to be done in hours if someone reads REALLY fast
    const totUpAverageTime = (): {time: number, format: "days" | "hours"} => {
        let totalTime: number = 0;
        finishedBooks.forEach(book => {
            if (book.startedAt !== null && book.finishedAt !== null) {
                const timePassedInMS = book.finishedAt.getTime() - book.startedAt.getTime();
                totalTime += timePassedInMS / millisecondsInADay;
            }
        })
        totalTime /= finishedBooks.length;
        // if total time is less than one day, need to format our output string to say hours
        const finalFormat = totalTime < 1 ? "hours" : "days";
        if (totalTime >= 1) {
            // take off the decimal point
            totalTime = Number(totalTime.toFixed(0));
        }
        else {
            // convert into something easily understandable in hours
            let temp = totalTime * 24;
            totalTime = Number(temp.toFixed(0));
        }
        return {time: totalTime, format: finalFormat}
    }

    const avgTime = totUpAverageTime();

    const getFastestRead = (): string => {
        let fastestTime = Number.MAX_SAFE_INTEGER;
        let fastestName = "";

        finishedBooks.forEach(book => {
            if (book.startedAt !== null && book.finishedAt !== null) {
                const timePassedInMS = book.finishedAt.getTime() - book.startedAt.getTime();
                if (timePassedInMS < fastestTime) { // todo to consider: how about ties?
                    fastestTime = timePassedInMS;
                    fastestName = book.title;
                }
            }
        })

        return fastestName;
    }

    return (
        <div>
            {finishedBooks === null || finishedBooks.length === 0 ?
            <p className={paragraphStyle}>Try finishing some books and see what shows up here!</p> :
            (<div className={divStyle}>
                <p className={paragraphStyle}>You have read <span className={spanStyle}>{totalBooksRead} {totalBooksRead === 1 ? "book" : "books"}</span> this year.</p>
                <p className={paragraphStyle}>The average time it takes you to finish a book is <span className={spanStyle}>{avgTime.time} {" "}
                    {avgTime.time === 1 ? /* remove trailing 's' */avgTime.format.split("s")[0] : avgTime.format}.</span></p>
                <p className={paragraphStyle}>The fastest book you read is <span className={spanStyle}>{getFastestRead()}</span>.</p>
            </div>) 
            }
        </div>
    )
}