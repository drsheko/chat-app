import moment from 'moment';
function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  function customMoment(timestamp) {
    let date = moment();
    let difference = dateDiffInDays(timestamp, date);
    if(difference===1){
        return moment(timestamp).format("h:mm a")
    }
    if(difference<8 &&
        moment(timestamp).format("YY") ===moment(date).format("YY")
    ){
        return moment(timestamp).format("h:mm a, D")
    }
    if( moment(timestamp).format("YY") ===moment(date).format("YY")){
        return moment(timestamp).format("MMM D, YY")
    }

  }
  export default customMoment