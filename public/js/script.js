const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Real-Time-Location-Tracker &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);
marker.on("drag", () => {});

socket.on("receive-location", (data) => {
  const { latitude, longitude } = data;
  map.setView([latitude, longitude], 10);
  if(marker[id]){
    marker[id].setLatLng([latitude, longitude]);
  }else{
    marker[id] = L.marker([latitude, longitude]).addTo(map);
  }
});


socket.on("user-disconnect", (id)=>{
  if(marker[id]){
    map.removeLayer(marker[id]);
    delete marker[id];
  }
})
