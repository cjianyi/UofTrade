export const addAnnouncement = dashboard => {
    if (dashboard.state.announcementTitle !== '' && dashboard.state.announcementMessage !== '')
    {
        const announcementList = dashboard.state.announcements;
        const announcement = {
            title:  dashboard.state.announcementTitle, 
            content: dashboard.state.announcementMessage
        }
        announcementList.push(announcement)
        dashboard.setState({
            announcements: announcementList
        })
    }   
}

// remove annoucement
export const removeAnnouncement = (dashboard, announcement) => {
    const filteredAnnouncement = dashboard.state.announcements.filter(a => {
        return a !== announcement
    })
    dashboard.setState({
        announcements: filteredAnnouncement
    })
}