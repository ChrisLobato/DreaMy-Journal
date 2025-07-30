const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { format, differenceInDays, startOfWeek } = require('date-fns')
//implement flask microservice in a later update
// const auth = require("../middleware/auth");


exports.getUser = async (req, res) => {
    const { username } = req.params // params will be a user identifier
    const user = await prisma.user.findUnique({ where: { username }});
    if(!user){
        return res.status(400).json({ErrorMsg : "User not found"});
    }
    return res.json(user);
}


//swapping to accounts only containing one journal for simplicity

exports.postEntry = async (req, res) => {
    //deconstruct body
    const { text, date } = req.body;
    const { userId } = req.params; // leaving it with generic name of userId since I'm not sure if i want username, email to be unique identifier outside of DB id not sure if that is unsafe
    const user = await prisma.user.findUnique({ where: { email: userId }});
    //TODO search for entry of same day/Month/Year
    //If exists update otherwise create a new one
    const dateToCheck = new Date(date);
    const startOfDay = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
    const endOfDay = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate(), 23, 59, 59, 999);
    const existingEntry = await prisma.entry.findFirst({
        where: { 
            userId: user.id,
            createdAt: {
                gte: startOfDay,
                lt: endOfDay
            } 
        },
    });

    if (existingEntry){
        //Update the entry rather than create a new entry
        await prisma.entry.update({
            where: { id: existingEntry.id},
            data: { text }
        })
    }
    else{
        //Create a new entry since one does not already exist
        await prisma.entry.create({
        data: {
            text: text,
            createdAt: date,
            userId: user.id,
        }
        });
    }

    return res.json({
        message: "successfully added journal entry"
    });
}

//function to get entries made by a user, requires email to be in req params
exports.getEntries = async (req, res) => {
    const {
        email,
        page = 1,
        limit = 9,
        search = '',
        sort = 'desc',
        startDate,
        endDate
    } = req.query;
    //variable that dictates how many entries we want to skip
    //depending on how we can display on a page and how many pages we got
    const skip = (page - 1) * limit;
    //use spread operator to create the object if search exists and if start date and end date exist
    const filter = {
        user: {email},
        ...(search && {
            OR: [
                {text: {contains: search, mode: 'insensitive'}}
            ]
        }),
        ...(startDate && endDate &&{
            createdAt:{
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        }),
    };

    const entries = await prisma.entry.findMany({
        where: filter,
        orderBy: {
            createdAt: sort
        },
        skip: Number(skip),
        take: Number(limit)
    });

    const totalReturned = await prisma.entry.count({ where: filter });
    res.json({ entries, totalReturned });
}

exports.getEntriesByMonth = async (req, res) => {
    const { email } = req.params;
    const { year, month } = req.query;

    const startDate = new Date(year, month - 1, 1); //assuming month wont be 0 indexed
    const endDate = new Date(year, month, 0);

    const user = await prisma.user.findUnique({
      where: { email }  
    });
    //fetch them in ascending order
    const entries = await prisma.entry.findMany({
        where: {
            userId: user.id,
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        },
        orderBy: { 
            createdAt: 'desc'
        },
        select: {
            id: true,
            createdAt: true,
            text: true
        }
    });

    return res.json({userEntriesByMonth : entries});
}

exports.getUserStats = async (req, res) => {
    const { email } = req.params;
    
    const allUserEntries = await prisma.entry.findMany({
        where:{
            user: { email }
        },
        orderBy: { 
            createdAt: 'asc'
        }
    });

    //obtain the word count stats
    const wordCountInitial = 0;
    const wordCount = allUserEntries.reduce(
        (accumulator, currentValue) =>{
            const wordArray = currentValue.text.split(" ");
            const curWordCount = wordArray.length;
            return accumulator + curWordCount
        }
    , wordCountInitial);

    //obtain streak stats
    let curStreak = 1;
    let longestStreak = 1;
    for(i = 1; i < allUserEntries.length; i++){
        //normalize date maybe just convert all dates before to avoid O(2n) format operations
        const currentDate = format(new Date(allUserEntries[i].createdAt), 'yyyy-MM-dd');
        const lastDate = format(new Date(allUserEntries[i-1].createdAt), 'yyyy-MM-dd');
        const difference = differenceInDays(currentDate,lastDate);
        if(difference === 1){
            curStreak++;
            longestStreak = Math.max(curStreak,longestStreak)
        }
        else if(difference === 0){
            curStreak = 1
        }
    }
    const lastDate = allUserEntries[allUserEntries.length-1].createdAt;
    //TODO remove abs as no longer needed due to strict requirement now imposed on only writing posts on or before current dat 
    if(Math.abs(differenceInDays(new Date(), lastDate)) > 1){
        curStreak = 0; // in the case that the most recent date is not the same as today
    }

    //get Entries over time
    const entriesByDate = {};
    for(i = 0; i < allUserEntries.length; i++){
        const weekOf = startOfWeek(allUserEntries[i].createdAt, { weekStartsOn: 1 });
        const weekKey = format(weekOf, "yyyy-MM-dd");
        if(entriesByDate.hasOwnProperty(weekKey)){
            entriesByDate[weekKey]++;
        }
        else{
            entriesByDate[weekKey] = 1
        }
    }

    //create my stats object
    const stats = {
        totalEntries: allUserEntries.length,
        wordCount: wordCount,
        avgWordCount: allUserEntries.length > 0 ? Math.round(wordCount/allUserEntries.length) : 0,
        curStreak: curStreak,
        longestStreak: longestStreak,
        entriesByDate:entriesByDate
    }
    
    res.json(stats);
}