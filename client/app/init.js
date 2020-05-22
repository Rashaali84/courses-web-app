export const init = () => {
  fetch('/api/courses/', {
    method: 'GET'
  })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      console.log(res);
      return res.json();
    })
    .then(records => {
      const container = document.getElementById('container');
      console.log(records);

      if (records.length > 1) {
        records.forEach(element => {
          container.innerHTML += '<li>' + JSON.stringify(element) + '</li>';
        })
      } else { container.innerHTML = JSON.stringify(records); }

      if (records.length <= 0) {
        container.innerHTML = 'No entries yet stored in db..';
      }
    })
    .catch(err => console.error(err));

  document.getElementById('save-button')
    .addEventListener('click', (e) => {
      const courseName = document.getElementById('name').value;
      saveCourse(courseName);
      e.preventDefault();
    });
  document.getElementById('update-button')
    .addEventListener('click', (e) => {
      const courseName = document.getElementById('name').value;
      const courseId = document.getElementById('courseId').value;
      updateCourse(courseName, courseId);
      e.preventDefault();
    });
  document.getElementById('delete-button')
    .addEventListener('click', (e) => {
      const courseId = document.getElementById('courseId').value;
      deleteCourse(courseId);
      e.preventDefault();
    });
}