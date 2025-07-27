-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2023 at 07:08 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotelnew`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `adminid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`email`, `password`, `adminid`) VALUES
('admin@gmail.com', '$2b$10$pFODoXNc5W7YQLNvhxhXSOnJly/JHy/wC4iU1UL6UqLtdsKWz62JW', 1);

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `bookingid` int(11) NOT NULL,
  `roomtype` varchar(200) NOT NULL,
  `roomcost` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `checkin` date NOT NULL,
  `checkout` date NOT NULL,
  `guests` int(10) NOT NULL,
  `roomid` int(11) NOT NULL,
  `bookingstatus` varchar(200) NOT NULL,
  `payment` varchar(200) NOT NULL,
  `roomnumber` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`bookingid`, `roomtype`, `roomcost`, `username`, `email`, `checkin`, `checkout`, `guests`, `roomid`, `bookingstatus`, `payment`, `roomnumber`) VALUES
(37, 'Deluxe Room', '3500', 'Charan', 'charan@gmail.com', '2023-04-21', '2023-04-22', 3, 6, 'Pending', 'fullpayment', 'Not allotted');

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `message` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `image` varchar(200) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`image`, `id`) VALUES
('https://i.ibb.co/GJ8T96d/gallery1.jpg', 3),
('https://i.ibb.co/wst3fkR/gallery2.jpg', 4);

-- --------------------------------------------------------

--
-- Table structure for table `hotelrooms`
--

CREATE TABLE `hotelrooms` (
  `roomname` varchar(200) NOT NULL,
  `roomcost` varchar(100) NOT NULL,
  `capacity` int(10) NOT NULL,
  `services` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `roomid` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `action` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hotelrooms`
--

INSERT INTO `hotelrooms` (`roomname`, `roomcost`, `capacity`, `services`, `description`, `roomid`, `image`, `action`) VALUES
('Couple Room', '2000', 2, 'Room Service, Spa Treatment, Romantic Package, House keeping, Candle light Dinner', 'The bedroom is cozy and inviting, with soft lighting and a plush queen-sized bed. A bookshelf lines the wall, displaying an array of colorful titles, and a window provides a view of the peaceful garde', 4, 'https://i.ibb.co/D9yJRBZ/couple.jpg', 'enable'),
('Deluxe Room', '3500', 4, 'Upgraded Amenities, In-room entertainment, Personalized service, Views and location, Additional space with mini swimming pool', 'This dulex room features plush furnishings, elegant decor, and high-end amenities for a truly luxurious stay. From the sumptuous king-size bed to the marble bathroom with a rain shower and deep soaking tub, every detail has been carefully curated to provide the ultimate indulgence.', 6, 'https://i.ibb.co/Ytxq3dq/Deluex-1.jpg', 'enable'),
('Super Deluxe Room', '5000', 5, 'Private Check-in and Check-Out, Personal Assistant service, Exclusive Lounge Access, Private Outdoor Space, High-end amenities', 'The super deluxe hotel room is a spacious and luxurious accommodation option. It features a comfortable king-sized bed, modern furnishings, a work desk, and a sitting area for relaxation. The room is equipped with amenities such as air conditioning, a flat-screen TV, and a private bathroom with premium toiletries.', 7, 'https://i.ibb.co/gVK340R/super-1.jpg', 'enable'),
('Standard Room', '1500', 3, 'Complimentary WiFi, Room Service, Housekeeping, Televison and entertainment, Access to hotel amenities', 'This standard room features a comfortable bed, a dresser or closet for storage, a desk or table with chair for work or dining, and a private bathroom with basic amenities. It may also include a TV, phone, and Wi-Fi access.', 10, 'https://i.ibb.co/WgndYmM/Standard.jpg', 'enable');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review` varchar(200) NOT NULL,
  `rating` int(1) NOT NULL,
  `email` varchar(200) NOT NULL,
  `action` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roomenquiry`
--

CREATE TABLE `roomenquiry` (
  `enquiryid` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `roomtype` varchar(200) NOT NULL,
  `enquiry` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('duehKHFPMZ3YL8U6sWv2bP7sAWdE-1p2', 1682096915, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2023-04-21T17:06:49.354Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"user\":{\"id\":11,\"email\":\"charan@gmail.com\"},\"isLoggedIn\":true,\"admin\":{\"id\":1,\"email\":\"admin@gmail.com\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` bigint(10) NOT NULL,
  `aadhar` bigint(12) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `mobile`, `aadhar`, `password`) VALUES
(10, 'Archana', 'archana@gmail.com', 8469713652, 123654789651, '$2b$10$l1Asj7zySqYNsa.tj6T18u3pe8oYnB0FeOk3E1/KAkdYkfSlhAelO'),
(11, 'Charan', 'charan@gmail.com', 8459632132, 978658421302, '$2b$10$Rl.8/PsyKL4VJXnyMZ5KbOqUIrRaU3Nh02kk7BY.NnV6qN5Bg4qXy'),
(13, 'Kiran M', 'kiran@gmail.com', 7894561230, 789456123012, '$2b$10$kUuVJt4M5W5lddfyD2Qgvu.anfYMeBC4yjhCei1vC2A0JI1Drx6Ze');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminid`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`bookingid`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotelrooms`
--
ALTER TABLE `hotelrooms`
  ADD PRIMARY KEY (`roomid`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `roomenquiry`
--
ALTER TABLE `roomenquiry`
  ADD PRIMARY KEY (`enquiryid`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `adminid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `bookingid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `hotelrooms`
--
ALTER TABLE `hotelrooms`
  MODIFY `roomid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `roomenquiry`
--
ALTER TABLE `roomenquiry`
  MODIFY `enquiryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
