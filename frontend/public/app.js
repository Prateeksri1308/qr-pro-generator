function showSection(id){document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");}
async function createQR(){const url=document.getElementById("targetUrl").value.trim();if(!url)return alert("Enter a URL");const res=await fetch("/api/shorten",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({target_url:url})});const data=await res.json();if(data.short_url){document.getElementById("qrResult").innerHTML=`
      <p>Short URL: <a href="${data.short_url}" target="_blank">${data.short_url}</a></p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.short_url)}"/>
    `;}else{alert("Error creating QR");}}
document.getElementById("batchForm")?.addEventListener("submit",async e=>{e.preventDefault();const file=document.getElementById("csvFile").files[0];if(!file)return alert("Choose a CSV file");const formData=new FormData();formData.append("file",file);const res=await fetch("/api/batch",{method:"POST",body:formData});if(res.ok){const blob=await res.blob();const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download="qrs.zip";link.click();document.getElementById("batchResult").innerText="ZIP downloaded!";}else{document.getElementById("batchResult").innerText="Batch failed!";}});
async function fetchAnalytics(){const code=document.getElementById("codeInput").value.trim();if(!code)return alert("Enter code");const res=await fetch(`/api/analytics/${code}`);const data=await res.json();if(data.total_scans!==undefined){document.getElementById("analyticsResult").innerHTML=`
      <p>Short URL: <a href="/r/${data.code}" target="_blank">/r/${data.code}</a></p>
      <p>Target URL: ${data.target_url}</p>
      <p>Total Scans: ${data.total_scans}</p>
    `;}else{document.getElementById("analyticsResult").innerText="Not found!";}}
async function signup(){const email=document.getElementById("emailInput").value.trim();if(!email)return alert("Enter email");const res=await fetch("/api/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});const data=await res.json();document.getElementById("signupResult").innerText=data.ok?"Thanks for signing up!":"Signup failed!";}
