import { type Book } from "@/db/schema";
import { FilterTab } from "./FilterTab";
import { timePeriod, TimePeriod } from "@/lib/format";

const TimeValues: Record<TimePeriod, string> = {
    all_time: "All Time",
    week: "Week",
    month: "Month",
    year: "Year"
}

function isValidTime(val: string | undefined) {
    return !!val && (timePeriod as readonly string[]).includes(val);
}

export async function ReadingStats({allBooks, timeQuery} : {allBooks : Book[], timeQuery: string | string[] | undefined}) {
    // todo: add timeframe options (week, month, year)
    const millisecondsInADay: number = 86_400_000 as const;
    const millisecondsInAWeek: number = millisecondsInADay * 7;
    const millsecondsInAMonth: number = millisecondsInADay * 30; // for now we are not overly concerned about individual month day counts
    const millisecondsInAYear: number = millisecondsInADay * 365; // for now we are not worried about leap years
    // default status is "all_time"
    const status = Array.isArray(timeQuery) ? timeQuery[0] : timeQuery !== undefined ? timeQuery : timePeriod[0];
    const activeStatus = isValidTime(status) ? status : timePeriod[0];

    const paragraphStyle: string = "text-md text-ink-muted";
    const spanStyle = "text-md text-ink font-bold";
    const divStyle: string = "rounded-xl border border-border bg-surface p-4 shadow-warm";
    

    const finishedBooks = allBooks.filter((book) => {
        return book.status === "finished";
    });
    /*
    fields:
    Total books read in the time period (For now, a year)
    Average time it takes to finish a book (measured in hours or days, whichever is smaller)
    Fastest read (measured in hours or days, whichever is smaller)
    */
    const getBooksInTimePeriod = () => {
        if (activeStatus === "all_time") {
            return finishedBooks;
        }
        else {
            const subMilliseconds = activeStatus === "week" ? millisecondsInAWeek : activeStatus === "month" ? millsecondsInAMonth : millisecondsInAYear;
            const nowInMilliseconds = Date.now();
            const finalTimeMS = nowInMilliseconds - subMilliseconds;
            const booksInTimePeriod = finishedBooks.filter((book) => {
                if (book.startedAt !== null) {
                    return book.startedAt.getTime() >= finalTimeMS;
                }
            })

            return booksInTimePeriod;
        }
    }

    const booksInTimePeriod = getBooksInTimePeriod();

    const totalBooksRead = booksInTimePeriod.length;

    // format may have to be done in hours if someone reads REALLY fast
    const totUpAverageTime = (): {time: number, format: "days" | "hours"} => {
        let totalTime: number = 0;
        booksInTimePeriod.forEach(book => {
            if (book.startedAt !== null && book.finishedAt !== null) {
                const timePassedInMS = book.finishedAt.getTime() - book.startedAt.getTime();
                totalTime += timePassedInMS / millisecondsInADay;
            }
        })
        // avoid division by zero
        totalTime = booksInTimePeriod.length === 0 ? 0 : totalTime / booksInTimePeriod.length;
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

        booksInTimePeriod.forEach(book => {
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

    const fastestRead = getFastestRead();

    const formatFastestRead = (<span className={spanStyle}>${fastestRead}</span>)

    return (
        <div>
            {finishedBooks === null || finishedBooks.length === 0 ?
            <p className={paragraphStyle}>Try finishing some books and see what shows up here!</p> :
            (<div className={divStyle}>
                <div className="flex gap-2 text-sm mb-2">
                    {timePeriod.map((v) => (
                        <FilterTab 
                        key={v}
                        href={`/?statusperiod=${v}`}
                        label={TimeValues[v]}
                        active={activeStatus === v}
                        />
                    ))}
                </div>
                {booksInTimePeriod === null || booksInTimePeriod.length === 0 ? 
                <p>Try reading some books this {activeStatus}!</p> :
                (<div>
                    <p className={paragraphStyle}>You have read <span className={spanStyle}>{totalBooksRead} {totalBooksRead === 1 ? "book" : "books"}</span>{" "} 
                        {activeStatus !== "all_time" ? "this " + activeStatus : "in total"}.</p>
                    <p className={paragraphStyle}>The average time it takes you to finish a book is <span className={spanStyle}>{avgTime.time} {" "}
                        {avgTime.time === 1 ? /* remove trailing 's' */avgTime.format.split("s")[0] : avgTime.format}.</span></p>
                    <p className={paragraphStyle}>The fastest book you read is <span className={spanStyle}>{fastestRead}.</span></p>
                </div>)}
            </div>) 
            }
        </div>
    )
}