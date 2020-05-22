const saveCourse = (courseName) => {
    fetch('/api/courses/', {
        method: 'POST',
        body: JSON.stringify({ name: courseName }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => {
            if (res.status === 404)
                throw err;
            alert('your changes are saved');
        })
        .then(() => { location.reload(); })
        .catch(err => {
            console.error(err);
            alert('unable to save your changes');
        });
}
const updateCourse = (courseName, courseId) => {
    fetch('/api/courses/' + courseId, {
        method: 'PUT',
        body: JSON.stringify({ name: courseName }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => {
            if (res.status === 404)
                throw err;
            alert('your changes are updates');
        })
        .then(() => { location.reload(); })
        .catch(err => {
            console.error(err);
            alert('unable to update your changes');
        });
}
const deleteCourse = (courseId) => {
    fetch('/api/courses/' + courseId, {
        method: 'DELETE',
    })
        .then((res) => {
            if (res.status === 404)
                throw err;
            alert('entry is deleted');
        })
        .then(() => { location.reload(); })
        .catch(err => {
            alert('unable to delete entry');
            console.error(err);
        });
}