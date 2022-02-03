USE [weppo]
GO

/****** Object:  Table [dbo].[PRODUCT]    Script Date: 03.02.2022 14:39:38 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[PRODUCT](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](20) NULL,
	[price] [int] NULL,
	[amount] [int] NULL,
	[img_path] [nvarchar](30) NULL,
	[description] [ntext] NULL,
	[category_id] [int] NULL,
 CONSTRAINT [PK_PRODUCT] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[PRODUCT]  WITH CHECK ADD  CONSTRAINT [FK_PRODUCT_CATEGORY] FOREIGN KEY([category_id])
REFERENCES [dbo].[CATEGORY] ([id])
GO

ALTER TABLE [dbo].[PRODUCT] CHECK CONSTRAINT [FK_PRODUCT_CATEGORY]
GO

