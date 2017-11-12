--
-- Creating database
--
CREATE DATABASE discount CHARACTER SET utf8 COLLATE utf8_general_ci;

--
-- Using created database
--
USE discount;

--
-- Creating table `users`
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `last` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `role` enum('super','admin','cashier') NOT NULL,
  `parent` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--
LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'Super','Superlast','super@s.com','$2a$05$63vJAM8ql9LYfVvwom/iMeLLbNErXfcsg67qBL5QEHZ82EkgS3W8u','super',0);
UNLOCK TABLES;