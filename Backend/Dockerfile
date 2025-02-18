# test dockerfile
FROM golang:1.21 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main

FROM ubuntu:22.04
WORKDIR /root/
COPY --from=build /app/main .
CMD ["./main"]