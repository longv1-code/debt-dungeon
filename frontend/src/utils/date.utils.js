import { format, formatDistanceToNow } from 'date-fns'

// Format a date as "Jan 1, 2024"
export const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy')
}

// Format as relative time: "2 days ago"
export const timeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
}