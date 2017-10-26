CREATE TABLE `organization` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `owner` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `organization`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `organization`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;