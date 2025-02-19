# ใช้ base image ของ Golang (เลือกเวอร์ชันที่ต้องการ)
FROM golang:1.21-alpine

# ตั้ง working directory ภายใน container
WORKDIR /app

# คัดลอกไฟล์ go.mod และ go.sum และติดตั้ง dependencies
COPY go.mod go.sum ./
RUN go mod download

# คัดลอกโค้ดทั้งหมดเข้า container
COPY . .

# สร้าง binary ชื่อ main
RUN go build -o main .

# เปิดพอร์ตที่แอปจะรัน (ตรงกับที่ระบุในโค้ด, 9898)
EXPOSE 9898

# คำสั่งเริ่มต้นเมื่อ container ทำงาน
CMD ["./main"]
