@PostMapping
public ResponseEntity<Complaint> submit(
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam String category,
        @RequestParam(required = false) Double latitude,
        @RequestParam(required = false) Double longitude,
        @RequestParam(required = false) String address,   // ✅ already added
        @RequestParam(required = false) Long departmentId,
        @RequestParam(required = false) MultipartFile photo,
        Authentication auth) throws Exception {

    String photoUrl = null;

    // Save uploaded photo
    if (photo != null && !photo.isEmpty()) {
        String uploadDir = "uploads/";
        new File(uploadDir).mkdirs();
        String filename = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
        photo.transferTo(new File(uploadDir + filename));
        photoUrl = "/uploads/" + filename;
    }

    ComplaintRequest request = new ComplaintRequest();
    request.setTitle(title);
    request.setDescription(description);
    request.setCategory(category);
    request.setLatitude(latitude);
    request.setLongitude(longitude);
    request.setDepartmentId(departmentId);

    // 🔥 IMPORTANT FIX (YOU MISSED THIS)
    request.setAddress(address);

    return ResponseEntity.ok(
        complaintService.submitComplaint(request, auth.getName(), photoUrl)
    );
}